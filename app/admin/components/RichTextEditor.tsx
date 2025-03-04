"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { BiImageAdd, BiBold, BiItalic, BiLink } from 'react-icons/bi';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      if (!event.target || !(event.target as HTMLInputElement).files) return;
      
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: result.url, alt: 'Uploaded image' })
            .run();
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    
    input.click();
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="bg-gray-100 p-2 border-b flex gap-2">
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          type="button"
        >
          <BiBold />
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          type="button"
        >
          <BiItalic />
        </button>
        <button 
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          type="button"
        >
          <BiImageAdd />
        </button>
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
}