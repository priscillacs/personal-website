import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  readTime: string;
  coverImage?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const categoryColors = {
    "product-management": "bg-purple-100 text-purple-800",
    "software-development": "bg-blue-100 text-blue-800",
    infrastructure: "bg-green-100 text-green-800",
    leadership: "bg-yellow-100 text-yellow-800",
    personal: "bg-red-100 text-red-800",
    project: "bg-indigo-100 text-indigo-800",
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getCategoryName = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-1 relative h-64 md:h-full bg-blue-50">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Blog Image
              </div>
            )}
          </div>
          <div className="md:col-span-3 p-6">
            <div className="flex flex-wrap items-center mb-3 gap-3">
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                  post.category
                )}`}
              >
                {getCategoryName(post.category)}
              </span>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
              </span>
              <span className="text-gray-500 text-sm">{post.readTime}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {post.title}
            </h2>

            <p className="text-gray-600 mb-4">{post.excerpt}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-block text-gray-500 text-xs">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>

            <span className="inline-block text-blue-600 font-medium hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
