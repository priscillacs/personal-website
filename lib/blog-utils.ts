// lib/blog-utils.ts
import connectToDatabase from "./mongodb";
import Post, { IPost } from "../models/Posts";

export async function getAllPosts() {
  try {
    await connectToDatabase();
    return await Post.find({}).sort({ publishedAt: -1 }).lean();
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    return []; // Return empty array instead of failing
  }
}

export async function getPostBySlug(slug: string) {
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug, published: true }).lean();
    return post;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    return null;
  }
}

export async function getPostsByCategory(category: string) {
  try {
    await connectToDatabase();
    const posts = await Post.find({ category, published: true })
      .sort({ publishedAt: -1 })
      .lean();
    return posts;
  } catch (error) {
    console.error("Error in getPostsByCategory:", error);
    return []; // Return empty array instead of failing
  }
}

export async function getPostsByTag(tag: string) {
  try {
    await connectToDatabase();
    const posts = await Post.find({ tags: tag, published: true })
      .sort({ publishedAt: -1 })
      .lean();
    return posts;
  } catch (error) {
    console.error("Error in getPostsByTag:", error);
    return []; // Return empty array instead of failing
  }
}

export async function getCategories() {
  try {
    await connectToDatabase();
    // Find all distinct categories from published posts
    const categories = await Post.distinct("category", { published: true });
    // Filter out null or undefined categories and sort them alphabetically
    return categories
      .filter((category) => category) // Remove empty categories
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error in getCategories:", error);
    return []; // Return empty array instead of failing
  }
}

// Add this function to get category counts
export async function getCategoryCounts() {
  try {
    await connectToDatabase();
    const categories = await getCategories();
    const counts: Record<string, number> = {};

    // Get count for each category
    for (const category of categories) {
      const count = await Post.countDocuments({
        category,
        published: true,
      });
      counts[category] = count;
    }
    return counts;
  } catch (error) {
    console.error("Error in getCategoryCounts:", error);
    return {}; // Return empty object instead of failing
  }
}

// Function to normalize a category string to match the expected schema format
export function normalizeCategory(category: string): string {
  try {
    // Convert to lowercase and ensure it matches one of the valid enum values
    const normalized = category.toLowerCase();

    // Map the normalized input to your schema's expected values
    const categoryMap: Record<string, string> = {
      "software-development": "software-development",
      "software development": "software-development",
      travel: "travel",
      personal: "personal",
      project: "project",
      reflection: "reflection",
      // Add any other variations that users might input
    };

    // Return the mapped category if found, or a default
    return categoryMap[normalized] || "software-development";
  } catch (error) {
    console.error("Error in normalizeCategory:", error);
    return "software-development"; // Safe default
  }
}

export async function createPost(postData: Partial<IPost>) {
  try {
    await connectToDatabase();

    // Clean markdown content if it has HTML entities
    if (postData.content) {
      postData.content = unescapeHTML(postData.content);
    }

    // Normalize category
    if (postData.category) {
      postData.category = normalizeCategory(postData.category);
    }

    const post = new Post({
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: postData.published ? new Date() : null,
    });
    await post.save();
    return post;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error; // Rethrow for API routes to handle
  }
}

export async function updatePost(id: string, postData: Partial<IPost>) {
  try {
    await connectToDatabase();

    // Clean markdown content if it has HTML entities
    if (postData.content) {
      postData.content = unescapeHTML(postData.content);
    }

    // Normalize category
    if (postData.category) {
      postData.category = normalizeCategory(postData.category);
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...postData,
        updatedAt: new Date(),
        publishedAt:
          postData.published && !postData.publishedAt
            ? new Date()
            : postData.publishedAt,
      },
      { new: true }
    );
    return post;
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw error; // Rethrow for API routes to handle
  }
}

export async function deletePost(id: string) {
  try {
    await connectToDatabase();

    // Find the post first to check if it exists
    const post = await Post.findById(id);

    if (!post) {
      return { success: false, message: "Post not found" };
    }

    // Delete the post
    const result = await Post.findByIdAndDelete(id);

    if (!result) {
      return { success: false, message: "Failed to delete post" };
    }

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Server error while deleting post" };
  }
}

// Helper function to unescape HTML entities
function unescapeHTML(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export async function getPostById(id: string) {
  try {
    await connectToDatabase();
    const post = await Post.findById(id).lean();
    return post;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

// Add this function to your blog-utils.ts file
export async function checkSlugExists(slug: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/posts/check-slug?slug=${encodeURIComponent(slug)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking slug:", error);
    // Default to assuming it exists on error (safer)
    return true;
  }
}
