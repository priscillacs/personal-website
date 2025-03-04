"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState, useEffect } from "react";

// Create a client component that safely uses useSearchParams
function CategoryListContent({ 
  categories, 
  counts = {}, 
  isInlineCategoryFilter = false 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // Use this instead of useSearchParams directly
  useEffect(() => {
    // Extract the category from URL instead of using useSearchParams
    if (isInlineCategoryFilter) {
      const urlParams = new URLSearchParams(window.location.search);
      setCurrentCategory(urlParams.get("category"));
    }
  }, [isInlineCategoryFilter, pathname]);

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
    if (!isInlineCategoryFilter) return; // Only handle clicks in main blog page

    if (category) {
      router.push(
        `/blog?category=${encodeURIComponent(
          category.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    } else {
      router.push("/blog");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>

      {categories.length > 0 ? (
        <motion.ul
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.li variants={itemVariants}>
            
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(null);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                !currentCategory && isInlineCategoryFilter
                  ? "bg-blue-100 text-blue-700"
                  : pathname === "/blog" && !isInlineCategoryFilter
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>All Posts</span>
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {totalPosts}
              </span>
            </a>
          </motion.li>

          {categories.map((category) => (
            <motion.li key={category} variants={itemVariants}>
              
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer ${
                  isInlineCategoryFilter &&
                  currentCategory ===
                    category.toLowerCase().replace(/\s+/g, "-")
                    ? "bg-blue-100 text-blue-700"
                    : !isInlineCategoryFilter &&
                      pathname.includes(
                        `/blog/category/${encodeURIComponent(
                          category.toLowerCase().replace(/\s+/g, "-")
                        )}`
                      )
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="capitalize">{category}</span>
                {counts[category] && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {counts[category]}
                  </span>
                )}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="text-gray-500">No categories found</p>
      )}
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function CategoryList(props) {
  return (
    <Suspense fallback={<div className="bg-white rounded-lg shadow-md p-6">Loading categories...</div>}>
      <CategoryListContent {...props} />
    </Suspense>
  );
}