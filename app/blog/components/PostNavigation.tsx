"use client";

import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface PostNavigationProps {
  previousPost?: {
    slug: string;
    title: string;
  };
  nextPost?: {
    slug: string;
    title: string;
  };
}

export default function PostNavigation({
  previousPost,
  nextPost,
}: PostNavigationProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-6">
      <div className="flex justify-between items-center">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex items-center group text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Previous Post
              </div>
              <div className="font-medium">{previousPost.title}</div>
            </div>
          </Link>
        ) : (
          <Link
            href="/blog"
            className="flex items-center group text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Back to
              </div>
              <div className="font-medium">All Posts</div>
            </div>
          </Link>
        )}

        {nextPost && (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center group text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-right"
          >
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Next Post
              </div>
              <div className="font-medium">{nextPost.title}</div>
            </div>
            <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
