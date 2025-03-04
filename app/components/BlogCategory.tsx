"use client";

import { useState } from "react";
import Link from "next/link";

// Sample categories with counts
const categories = [
  { name: "All", slug: "", count: 10 },
  { name: "Product Management", slug: "product-management", count: 3 },
  { name: "Software Development", slug: "software-development", count: 4 },
  { name: "Infrastructure", slug: "infrastructure", count: 2 },
  { name: "Leadership", slug: "leadership", count: 2 },
  { name: "Personal", slug: "personal", count: 1 },
  { name: "Project", slug: "project", count: 1 },
];

export default function BlogCategories() {
  const [activeCategory, setActiveCategory] = useState("");

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index}>
            <Link
              href={category.slug ? `/blog/category/${category.slug}` : "/blog"}
              onClick={() => handleCategoryClick(category.slug)}
              className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                activeCategory === category.slug
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`text-sm ${
                  activeCategory === category.slug
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                } px-2 py-1 rounded-full`}
              >
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
