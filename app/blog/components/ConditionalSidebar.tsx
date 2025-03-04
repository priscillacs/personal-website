"use client";

import { usePathname } from "next/navigation";
import CategoryList from "./CategoryList";

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <CategoryList
          categories={categories}
          counts={categoryCounts}
          isInlineCategoryFilter={pathname === "/blog"}
        />
      </div>
    );
  }

  // Hide sidebar on individual post pages
  return null;
}
