"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState, useEffect } from "react";

interface CategoryListContentProps {
  categories: string[];
  counts?: Record<string, number>;
  isInlineCategoryFilter?: boolean;
}

// Create a client component that safely uses useSearchParams
function CategoryListContent({
  categories,
  counts = {},
  isInlineCategoryFilter = false,
}: CategoryListContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Use this instead of useSearchParams directly
  useEffect(() => {
    if (isInlineCategoryFilter) {
      // Get category from search params
      const category = searchParams.get("category");
      setCurrentCategory(category);
    } else if (pathname.startsWith("/blog/category/")) {
      // Extract category from pathname for category pages
      const pathParts = pathname.split("/");
      const categoryFromPath = pathParts[pathParts.length - 1];
      setCurrentCategory(categoryFromPath);
    } else {
      setCurrentCategory(null);
    }
  }, [isInlineCategoryFilter, pathname, searchParams]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  // Calculate total posts for "All" category
  const totalPosts = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Handle category click for in-page filtering
  const handleCategoryClick = (category: string | null) => {
    if (isInlineCategoryFilter) {
      // For main blog page, update URL query parameter
      if (category) {
        const encodedCategory = encodeURIComponent(
          category.toLowerCase().replace(/\s+/g, "-")
        );
        router.push(`/blog?category=${encodedCategory}`);
        setCurrentCategory(encodedCategory);
      } else {
        router.push("/blog");
        setCurrentCategory(null);
      }
    } else {
      // For other pages, navigate to category page
      if (category) {
        const encodedCategory = encodeURIComponent(
          category.toLowerCase().replace(/\s+/g, "-")
        );
        router.push(`/blog/category/${encodedCategory}`);
      } else {
        router.push("/blog");
      }
    }
  };

  // Function to determine if a category is active
  const isCategoryActive = (category: string | null): boolean => {
    if (category === null) {
      return !currentCategory;
    }

    const normalizedCategory = category.toLowerCase().replace(/\s+/g, "-");
    return normalizedCategory === currentCategory;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Categories
      </h3>

      {categories.length > 0 ? (
        <motion.ul
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.li variants={itemVariants}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(null);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                isCategoryActive(null)
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span>All Posts</span>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                {totalPosts}
              </span>
            </a>
          </motion.li>

          {categories.map((category) => (
            <motion.li key={category} variants={itemVariants}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                  isCategoryActive(category)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="capitalize">{category}</span>
                {counts[category] && (
                  <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                    {counts[category]}
                  </span>
                )}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No categories found</p>
      )}
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function CategoryList(props: CategoryListContentProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          Loading categories...
        </div>
      }
    >
      <CategoryListContent {...props} />
    </Suspense>
  );
}
