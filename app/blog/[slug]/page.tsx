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
  // Your existing metadata generation
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

  // Ensure content is unescaped before processing
  let cleanContent = post.content || "";

  // Unescape HTML entities if they exist
  cleanContent = cleanContent
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  //
  // Inside your component, before rendering
  const htmlContent = configuredMarked(post.content);
  console.log("Markdown content:", post.content);
  console.log("Rendered HTML:", htmlContent);
  // Inside your component
  console.log("Post last updated:", post.updatedAt);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          {post.date && <time>{formatDate(post.date)}</time>}
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
