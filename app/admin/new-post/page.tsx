"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { configuredMarked } from "../../../utils/markdownConfig.js"; // Note the .js extension

// Categories for the dropdown
const categories = [
  { name: "Software Development", value: "software-development" },
  { name: "Travel", value: "travel" },
  { name: "Personal", value: "personal" },
  { name: "Project", value: "project" },
  { name: "Reflection", value: "reflection" },
];

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Trim leading/trailing spaces
};

export default function NewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "", // Initialize with empty string, not null or undefined
    category: "software-development",
    tags: "",
    published: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to upload image
  const imageUploadFunction = useCallback(
    async (
      file: File,
      onSuccess: (url: string) => void,
      onError: (error: string) => void
    ) => {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const data = await response.json();
        console.log("Upload response:", data); // Debug log

        // Ensure URL is correctly formatted with leading slash if missing
        const url = data.url.startsWith("/") ? data.url : `/${data.url}`;
        onSuccess(url); // Pass the properly formatted URL
      } catch (error: any) {
        console.error("Error uploading image:", error);
        onError(error.message || "Error uploading image");
      }
    },
    []
  );

  // SimpleMDE custom options
  const editorOptions = {
    spellChecker: false,
    placeholder: "Write your post content here...",
    status: ["lines", "words", "cursor"],
    renderingConfig: {
      singleLineBreaks: false,
      codeSyntaxHighlighting: false, // Disable syntax highlighting while typing
    },
    autofocus: false, // Don't auto focus on load
    indentWithTabs: true,
    tabSize: 4,
    lineWrapping: true,
    autosave: {
      enabled: true,
      uniqueId: "new-post-content", // Use unique ID for autosave
      delay: 5000, // Save every 5 seconds instead of the default 1 second
    },
    previewRender: useCallback((text) => {
      // Only perform rendering when actually in preview mode
      return configuredMarked(text || "");
    }, []),

    // Add custom upload handler for images
    toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      "quote",
      "unordered-list",
      "ordered-list",
      "|",
      {
        name: "custom-image",
        action: (editor) => {
          // Create a file input
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          // When file is selected, upload it
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // Show loading indicator in editor
            const cm = editor.codemirror;
            const cursorPos = cm.getCursor();
            const loadingText = "![Uploading image...](...)";
            cm.replaceRange(loadingText, cursorPos);
            const loadingPlaceholderPos = {
              from: cursorPos,
              to: {
                line: cursorPos.line,
                ch: cursorPos.ch + loadingText.length,
              },
            };

            // Upload the file
            imageUploadFunction(
              file,
              (url) => {
                // Make sure URL is absolute (without domain) and points to public folder
                const publicUrl = url.startsWith("/") ? url : `/${url}`;

                // Replace loading placeholder with actual image markdown
                // Use syntax that's more explicit for the markdown parser
                const imageMarkdown = `![Image](${publicUrl} "Image")`;
                cm.replaceRange(
                  imageMarkdown,
                  loadingPlaceholderPos.from,
                  loadingPlaceholderPos.to
                );
              },
              (error) => {
                // Error handling remains the same
                cm.replaceRange(
                  `<!-- Image upload failed: ${error} -->`,
                  loadingPlaceholderPos.from,
                  loadingPlaceholderPos.to
                );
              }
            );
          };

          // Trigger file selection
          input.click();
        },
        className: "fa fa-image",
        title: "Upload Image",
      },
      "link",
      "|",
      "preview",
      "side-by-side",
      "fullscreen",
      "|",
      "guide",
    ],
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      // If title is changed, generate a slug
      if (name === "title" && !formData.slug) {
        setFormData({
          ...formData,
          [name]: value,
          slug: generateSlug(value),
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  // Memoize the editor change handler to prevent recreating on each render
  const handleEditorChange = useCallback((value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formData.title) {
      setErrorMessage("Title is required");
      return;
    }

    if (!formData.content) {
      setErrorMessage("Content is required");
      return;
    }

    // Transform tags from comma-separated string to array
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      console.log("Submitting data:", formData);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          content: formData.content, // This is now raw markdown
          readTime: `${Math.max(
            1,
            Math.ceil(formData.content.length / 1000)
          )} min read`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      router.push("/admin");
    } catch (error: any) {
      console.error("Error creating post:", error);
      setErrorMessage(
        error.message ||
          "Network error. Please check your connection and try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                Create New Post
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  previewMode
                    ? "bg-gray-200 text-gray-700 border-gray-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {previewMode ? "Edit" : "Preview"}
              </button>
              <button
                type="submit"
                form="post-form"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
              >
                <FaSave className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {previewMode ? (
          <div className="bg-white shadow-md rounded-lg p-8">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${
                formData.category === "product-management"
                  ? "bg-purple-100 text-purple-800"
                  : formData.category === "software-development"
                  ? "bg-blue-100 text-blue-800"
                  : formData.category === "infrastructure"
                  ? "bg-green-100 text-green-800"
                  : formData.category === "leadership"
                  ? "bg-yellow-100 text-yellow-800"
                  : formData.category === "personal"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {formData.category
                ? formData.category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : "No Category Selected"}
            </span>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {formData.title || "Untitled Post"}
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              {formData.excerpt || "No excerpt provided"}
            </p>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  configuredMarked(formData.content) || "No content provided",
              }}
            />

            {formData.tags && (
              <div className="mt-8 flex flex-wrap gap-2">
                {formData.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form
            id="post-form"
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-8"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="post-url-slug"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The URL-friendly version of the title. Auto-generated from
                  title.
                </p>
              </div>

              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief summary of the post (max 300 characters)"
                  maxLength={300}
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content *
                </label>
                <SimpleMDE
                  key="simplemde-editor"
                  value={formData.content}
                  onChange={handleEditorChange}
                  options={editorOptions}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use Markdown syntax for formatting. Click the image button to
                  upload images.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Comma-separated list of tags.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Publish immediately
                </label>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
