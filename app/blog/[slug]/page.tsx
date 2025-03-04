// Update app/blog/[slug]/page.tsx

import { getPostBySlug, getAllPosts } from "../../../lib/blog-utils";
import { notFound } from "next/navigation";
import PostNavigation from "../components/PostNavigation";
import { Metadata } from "next";
import { configuredMarked } from "../../../utils/markdownConfig";
import { formatDate } from "../../../lib/date-utils";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found",
    };
  }

  return {
    title: `${post.title} | Blog | Priscilla Celine`,
    description:
      post.excerpt || `Read ${post.title} on Priscilla Celine's blog`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get previous and next posts
  const allPosts = await getAllPosts();
  const currentPostIndex = allPosts.findIndex((p) => p.slug === params.slug);

  const previousPost =
    currentPostIndex > 0
      ? {
          slug: allPosts[currentPostIndex - 1].slug,
          title: allPosts[currentPostIndex - 1].title,
        }
      : undefined;

  const nextPost =
    currentPostIndex < allPosts.length - 1
      ? {
          slug: allPosts[currentPostIndex + 1].slug,
          title: allPosts[currentPostIndex + 1].title,
        }
      : undefined;

  // Ensure content is clean and safe before processing
  let cleanContent = post.content || "";

  // Unescape HTML entities if they exist
  cleanContent = cleanContent
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  // Fix broken image references by replacing them with a warning message
  cleanContent = cleanContent.replace(
    /!\[(.*?)\]\(\s*\)/g,
    "![Missing image]() <!-- Missing image reference -->"
  );

  // Add base path to relative image URLs if needed
  cleanContent = cleanContent.replace(
    /!\[(.*?)\]\((?!http|\/)(.*?)\)/g,
    "![$1](/$2)"
  );

  // Handle potential rendering errors
  let htmlContent = "";
  try {
    htmlContent = configuredMarked(cleanContent);
  } catch (error) {
    console.error("Error rendering markdown:", error);
    htmlContent = `<div class="p-4 text-red-600 bg-red-50 rounded mb-4">
      Error rendering content. Please contact the administrator.
    </div>
    <p>${cleanContent}</p>`;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          {post.publishedAt && (
            <time>{formatDate(new Date(post.publishedAt))}</time>
          )}
          {post.author && <span> · {post.author}</span>}
        </div>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={`Cover image for ${post.title}`}
            className="w-full h-auto rounded-lg object-cover"
          />
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      {/* Add post navigation at the bottom */}
      <PostNavigation previousPost={previousPost} nextPost={nextPost} />
    </article>
  );
}
