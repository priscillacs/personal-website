import {
  getAllPosts,
  getCategories,
  getCategoryCounts,
  getPostsByCategory,
} from "../../lib/blog-utils";
import PostCard from "./components/PostCard";
import { Metadata } from "next";
import { BiListUl, BiGridAlt } from "react-icons/bi";

export const metadata: Metadata = {
  title: "Blog | Priscilla Celine",
  description: "Articles about web development, design, and more",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get selected category from URL params (if any)
  const selectedCategory = searchParams.category as string | undefined;

  // Get display style from URL params - default to 'list' if not specified
  const displayStyle =
    (searchParams.style as string) === "cards" ? "cards" : "list";

  // Get posts based on category filter
  let posts;
  let displayCategory = null;

  if (selectedCategory) {
    // If category is specified, get the posts for that category
    const normalizedSearchCategory = selectedCategory.replace(/-/g, " ");

    // Find case-insensitive match for the category
    const categories = await getCategories();
    const matchedCategory = categories.find(
      (cat) => cat.toLowerCase() === normalizedSearchCategory.toLowerCase()
    );

    if (matchedCategory) {
      posts = await getPostsByCategory(matchedCategory);
      displayCategory = matchedCategory;
    } else {
      // If category doesn't match, show all posts
      posts = await getAllPosts();
    }
  } else {
    // No category specified, show all posts
    posts = await getAllPosts();
  }

  return (
    <div className="space-y-8">
      {/* Full-width banner */}
      <div className="bg-blue-50 dark:bg-gray-800/40 py-16 px-6 -mx-6 md:-mx-12 lg:-mx-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {displayCategory ? `${displayCategory} Posts` : "Blog"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {displayCategory
              ? `Browse ${posts.length} ${
                  posts.length === 1 ? "post" : "posts"
                } in ${displayCategory}`
              : "Thoughts, stories, and ideas on product management, software development, and personal experiences."}
          </p>
        </div>
      </div>

      {/* View toggles and post counter */}
      <div className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-gray-600 dark:text-gray-300">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
          {displayCategory ? ` in ${displayCategory}` : ""}
        </div>

        {/* View toggle buttons as icons */}
        {posts.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 mr-2">View:</span>
            <a
              href={`/blog${
                selectedCategory ? `?category=${selectedCategory}` : ""
              }${selectedCategory ? "&style=list" : "?style=list"}`}
              className={`p-2 rounded-md transition-colors ${
                displayStyle === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <BiListUl size={20} />
            </a>
            <a
              href={`/blog${
                selectedCategory ? `?category=${selectedCategory}` : ""
              }${selectedCategory ? "&style=cards" : "?style=cards"}`}
              className={`p-2 rounded-md transition-colors ${
                displayStyle === "cards"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Card view"
            >
              <BiGridAlt size={20} />
            </a>
          </div>
        )}
      </div>

      {/* Content adjusted to have margin-right for the sidebar space on desktop */}
      <div className="w-full md:pr-[300px]">
        {posts.length > 0 ? (
          displayStyle === "cards" ? (
            /* Card grid layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <PostCard post={post} isCompact={true} />
                </div>
              ))}
            </div>
          ) : (
            /* List layout - full width posts */
            <div className="grid grid-cols-1 gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
