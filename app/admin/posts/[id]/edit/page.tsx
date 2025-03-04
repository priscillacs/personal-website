// Add this to your form component

import { useState, useEffect } from "react";

import { getCategories } from "../../../../../lib/blog-utils";
const EditPostForm = ({ post }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    // other form fields
    category: post?.category || "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };

    loadCategories();
  }, []);

  // Category handling
  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
  };

  const handleAddNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setFormData({
        ...formData,
        category: newCategory,
      });
      setNewCategory("");
    }
  };

  return (
    <form>
      {/* Other form fields */}

      <div className="mb-6">
        <label
          htmlFor="category"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Category
        </label>
        <div className="flex gap-2">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex">
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Rest of your form */}
    </form>
  );
};
