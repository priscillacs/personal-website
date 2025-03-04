"use client";

import Link from "next/link";

// Define the Post interface (now with string IDs and ISO date strings)
interface Post {
  _id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  publishedAt?: string | null;
}

interface AdminPostListProps {
  initialPosts: Post[];
}

export default function AdminPostList({ initialPosts }: AdminPostListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b text-left">Title</th>
            <th className="py-3 px-4 border-b text-left">Category</th>
            <th className="py-3 px-4 border-b text-left">Published</th>
            <th className="py-3 px-4 border-b text-left">Date</th>
            <th className="py-3 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {initialPosts.map((post) => (
            <tr key={post._id}>
              <td className="py-3 px-4 border-b">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
              </td>
              <td className="py-3 px-4 border-b">{post.category}</td>
              <td className="py-3 px-4 border-b">
                {post.published ? "✅" : "❌"}
              </td>
              <td className="py-3 px-4 border-b">
                {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
              </td>
              <td className="py-3 px-4 border-b text-center">
                <Link
                  href={`/admin/edit/${post._id}`}
                  className="text-blue-600 hover:text-blue-800 mr-4"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Use a consistent date format function that gives the same result on both server and client
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
