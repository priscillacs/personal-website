"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

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
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Function to open delete confirmation modal
  const openDeleteModal = (post: Post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  // Function to handle post deletion
  const handleDeletePost = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${postToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the post from the state
        setPosts(posts.filter((post) => post._id !== postToDelete._id));
        closeDeleteModal();
      } else {
        const error = await response.json();
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No posts found. Create your first post!
            </p>
            <Link
              href="/admin/new-post"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Post
            </Link>
          </div>
        ) : (
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
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="py-3 px-4 border-b">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border-b capitalize">
                    {post.category.replace(/-/g, " ")}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {post.published ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <div className="flex justify-center space-x-3">
                      <Link
                        href={`/admin/edit/${post._id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit post"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(post)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete post"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          postTitle={postToDelete.title}
          onClose={closeDeleteModal}
          onConfirm={handleDeletePost}
          isDeleting={isDeleting}
        />
      )}
    </>
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
