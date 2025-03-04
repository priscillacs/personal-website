"use client";

import { usePathname } from "next/navigation";
import CategoryList from "./CategoryList";
import { Suspense } from "react";

type Props = {
  categories: string[];
  categoryCounts: Record<string, number>;
};

export default function ConditionalSidebar({
  categories,
  categoryCounts,
}: Props) {
  const pathname = usePathname();

  // Show sidebar only on main blog page and category pages
  // Hide on individual post pages
  if (pathname === "/blog" || pathname.startsWith("/blog/category/")) {
    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mt-10 ml-8"
        style={{ position: "static", top: "auto", transform: "none" }}
      >
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryList
            categories={categories}
            counts={categoryCounts}
            isInlineCategoryFilter={pathname === "/blog"}
          />
        </Suspense>
      </div>
    );
  }

  // Hide sidebar on individual post pages
  return null;
}
