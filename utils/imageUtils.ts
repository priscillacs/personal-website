// Create a new file at utils/imageUtils.ts

/**
 * Utility functions for debugging and fixing image paths
 */

/**
 * Debug log an image path with context
 */
export const debugImagePath = (path: any, context: string = "unspecified") => {
  console.log(`[IMAGE-DEBUG] Context: ${context}`);
  console.log(`[IMAGE-DEBUG] Type: ${typeof path}`);
  console.log(`[IMAGE-DEBUG] Value: ${path}`);

  if (typeof path === "object") {
    try {
      console.log(`[IMAGE-DEBUG] Stringified: ${JSON.stringify(path)}`);
    } catch (e) {
      console.log(`[IMAGE-DEBUG] Failed to stringify object`);
    }
  }
};

/**
 * Normalize an image path to ensure it starts with a slash
 */
export const normalizeImagePath = (path: any): string => {
  // Handle non-string paths
  if (typeof path !== "string") {
    console.warn(`[IMAGE-WARN] Non-string path: ${path}`);
    return "#";
  }

  // Skip external URLs
  if (path.startsWith("http")) {
    return path;
  }

  // Add leading slash if missing
  return path.startsWith("/") ? path : `/${path}`;
};

/**
 * Sanitize a filename for use in markdown
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[[\]()]/g, "") // Remove markdown special characters
    .replace(/[&+$~%'":*?<>{}]/g, "") // Remove other special characters
    .trim();
};

/**
 * Extract image paths from markdown content
 * Returns an array of image paths found in the markdown
 */
export const extractImagePaths = (markdown: string): string[] => {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    matches.push(match[1]);
  }

  return matches;
};

/**
 * Validate that all images in markdown content are properly formatted
 * Returns boolean indicating if all image references are valid
 */
export const validateMarkdownImages = (markdown: string): boolean => {
  const imagePaths = extractImagePaths(markdown);

  // Check each image path
  for (const path of imagePaths) {
    // Path should be a string
    if (typeof path !== "string") return false;

    // Path should not contain [object Object]
    if (path.includes("[object Object]")) return false;

    // Path should not be empty
    if (path.trim() === "") return false;
  }

  return true;
};

export const extractStringUrl = (url: any): string => {
  // Handle null/undefined
  if (url === null || url === undefined) {
    console.warn("[IMAGE-UTILS] URL is null or undefined");
    return "#";
  }

  // If it's already a string, just return it
  if (typeof url === "string") {
    return url;
  }

  // If it's an object, try to extract a path property or toString it
  if (typeof url === "object") {
    console.warn("[IMAGE-UTILS] URL is an object:", JSON.stringify(url));

    // Check for common properties that might contain the path
    if (url.path && typeof url.path === "string") {
      return url.path;
    }
    if (url.url && typeof url.url === "string") {
      return url.url;
    }

    // Last resort: stringify the object
    try {
      return JSON.stringify(url);
    } catch (e) {
      console.error("[IMAGE-UTILS] Failed to stringify URL object:", e);
      return "#";
    }
  }

  // For any other type, convert to string
  return String(url);
};

export function ensureStringUrl(value: any): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return "#";
  }

  // Already a string
  if (typeof value === "string") {
    // Ensure leading slash for relative URLs
    if (!value.startsWith("http") && !value.startsWith("/")) {
      return "/" + value;
    }
    return value;
  }

  // Handle objects - try to get path property
  if (typeof value === "object") {
    if (value.path && typeof value.path === "string") {
      return ensureStringUrl(value.path);
    }
    if (value.url && typeof value.url === "string") {
      return ensureStringUrl(value.url);
    }
    // Don't stringify objects for URLs - use a fallback
    return "#";
  }

  // Convert other types to string
  return String(value);
}
