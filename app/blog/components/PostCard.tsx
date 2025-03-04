import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../../../lib/utils";

interface PostProps {
  post: {
    _id: string;
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    category?: string;
    tags?: string[];
    published: boolean;
    featured?: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    publishedAt?: string | Date;
  };
  isCompact?: boolean;
}

export default function PostCard({ post, isCompact = false }: PostProps) {
  // Format the publication date
  const formattedDate = post.publishedAt
    ? formatDate(new Date(post.publishedAt))
    : null;

  // Generate a short excerpt if one doesn't exist
  const excerpt = post.excerpt || post.content.substring(0, 150) + "...";

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      {/* Don't wrap the entire card in a Link */}
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {post.category && (
          <div className="mb-2">
            <Link
              href={`/blog?category=${post.category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 capitalize"
            >
              {post.category}
            </Link>
          </div>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        <div className="text-sm text-gray-500 mb-4">
          {formattedDate && (
            <time dateTime={new Date(post.publishedAt!).toISOString()}>
              {formattedDate}
            </time>
          )}
        </div>

        <p className="text-gray-600 mb-4">{excerpt}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
