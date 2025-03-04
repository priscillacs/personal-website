import { Metadata } from "next";
import { getPostById } from "../../../../lib/blog-utils";
import { notFound } from "next/navigation";
import EditPostForm from "../../components/EditPostForm";

interface EditPostParams {
  id: string;
}

export default async function EditPostPage({
  params,
}: {
  params: EditPostParams;
}) {
  // Fetch the post data by ID
  const post = await getPostById(params.id);

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
}
