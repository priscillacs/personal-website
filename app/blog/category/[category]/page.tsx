// app/blog/category/[category]/page.tsx
import { getCategories, getPostsByCategory } from "../../../../lib/blog-utils";
import PostCard from "../../components/PostCard";
import { notFound } from "next/navigation";
import Link from "next/link";

// Make this function optional
export async function generateStaticParams() {
  try {
    const categories = await getCategories();

    return categories.map((category) => ({
      category: category.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty array to avoid build failure
  }
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  // Fix: Don't await params.category, it's already a string
  const category = params.category;

  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedCategory} | Blog | Priscilla Celine`,
    description: `Browse all articles in the ${formattedCategory} category`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  try {
    // Fix: Don't await params.category, it's already a string
    const category = params.category;
    const decodedCategory = decodeURIComponent(category);

    // Find case-insensitive match for the category
    const categories = await getCategories();

    // Handle hyphenated category slugs by converting them to spaces for comparison
    const normalizedSearchCategory = decodedCategory.replace(/-/g, " ");

    const matchedCategory = categories.find(
      (cat) => cat.toLowerCase() === normalizedSearchCategory.toLowerCase()
    );

    if (!matchedCategory) {
      notFound();
    }

    const posts = await getPostsByCategory(matchedCategory);

    return (
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {matchedCategory}
          </h1>
          <p className="text-gray-600">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this
            category
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-10">
            {posts.map((post) => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts found in this category.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    // Add error handling to prevent build failures
    console.error("Error in CategoryPage:", error);
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          Error loading category. Please try again later.
        </p>
      </div>
    );
  }
}
