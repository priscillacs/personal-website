import Link from "next/link";
import { getAllPosts } from "../../lib/blog-utils";
import AdminPostList from "./components/AdminPostList";

// This is a server component
export default async function AdminPage() {
  // Fetch the posts on the server
  const posts = await getAllPosts();

  // Convert MongoDB objects to plain objects with proper ID string conversion
  const serializedPosts = posts.map((post) => ({
    ...post,
    _id: post._id.toString(),
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt ? post.createdAt.toISOString() : null,
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/new-post"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          New Post
        </Link>
      </div>

      <AdminPostList initialPosts={serializedPosts} />
    </div>
  );
}
