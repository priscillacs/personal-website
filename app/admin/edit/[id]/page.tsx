// app/admin/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { getPostById } from "../../../../lib/blog-utils";
import EditPostForm from "../../components/EditPostForm";

// Using a simpler type declaration
interface PageParams {
  id: string;
}

export default async function EditPostPage({ params }: { params: PageParams }) {
  try {
    const { id } = params;

    if (!id) {
      return notFound();
    }

    // Fetch the post data by ID
    const post = await getPostById(id);

    if (!post) {
      return notFound();
    }

    // Convert MongoDB document to plain object with string ID
    const serializedPost = {
      ...post,
      _id: post._id.toString(),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt ? post.createdAt.toISOString() : null,
      updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
        <EditPostForm initialData={serializedPost} />
      </div>
    );
  } catch (error) {
    console.error("Error in EditPostPage:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Error Loading Post</h1>
        <p>There was an error loading this post for editing.</p>
      </div>
    );
  }
}

// These configuration exports help Next.js understand how to handle this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Simplified metadata function with same parameter type
export async function generateMetadata({ params }: { params: PageParams }) {
  const post = await getPostById(params.id);

  return {
    title: post ? `Edit: ${post.title}` : "Edit Post",
    description: "Edit an existing blog post",
  };
}
