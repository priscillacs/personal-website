import { marked } from "marked";

export function configureMarkdownRenderer() {
  const renderer = new marked.Renderer();

  // Safely get property from an object
  const safeGet = (obj: any, path: string, defaultValue: any = null) => {
    try {
      const parts = path.split(".");
      let result = obj;
      for (const part of parts) {
        if (result === null || result === undefined) return defaultValue;
        result = result[part];
      }
      return result === undefined ? defaultValue : result;
    } catch (e) {
      return defaultValue;
    }
  };

  // Override the image renderer
  renderer.image = function (href, title, text) {
    try {
      // Handle null or undefined href
      if (!href) {
        console.warn("Empty image href detected in markdown");
        return `<span class="text-red-500">[Invalid image: No source provided]</span>`;
      }

      // Ensure href is properly formatted with leading slash if needed
      let imgSrc = href;
      if (
        typeof href === "string" &&
        !href.startsWith("http") &&
        !href.startsWith("/")
      ) {
        imgSrc = `/${href}`;
      }

      // Handle [object Object] issues by converting to string if needed
      if (typeof imgSrc !== "string") {
        console.warn("Non-string image source detected:", imgSrc);
        imgSrc = String(imgSrc);
      }

      // Fix [object Object] issue if it appears
      if (imgSrc.includes("[object Object]")) {
        console.warn("Object detected as image source");
        return `<span class="text-red-500">[Invalid image: Object used as source]</span>`;
      }

      // For debugging
      console.log("Rendering image with src:", imgSrc);

      // Create the image HTML with proper attributes
      return `<img 
        src="${imgSrc}" 
        alt="${safeGet(text, "toString", text) || "Blog image"}" 
        title="${safeGet(title, "toString", title) || ""}" 
        class="blog-post-image"
        loading="lazy" 
      />`;
    } catch (error) {
      console.error("Error rendering image:", error);
      return `<span class="text-red-500">[Error rendering image]</span>`;
    }
  };

  // Configure marked with our custom renderer
  marked.setOptions({
    renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: false,
    pedantic: false,
    sanitize: false, // Don't sanitize HTML - Next.js handles this
    smartLists: true,
    smartypants: true, // Pretty quotes, ellipses, etc.
  });

  return marked;
}

// Export a safer version of the marked function that catches errors
export const configuredMarked = (text: string) => {
  try {
    // Process text to fix common issues before passing to marked

    // Replace any instances of [object Object] with a placeholder
    let processedText = text.replace(
      /\[object Object\]/g,
      '"[Invalid Object]"'
    );

    // Make sure all image references have valid URLs
    processedText = processedText.replace(
      /!\[(.*?)\]\((\[object Object\])\)/g,
      '![Invalid Reference]("#")'
    );

    // Return the rendered HTML
    return configureMarkdownRenderer()(processedText || "");
  } catch (error) {
    console.error("Error in configuredMarked:", error);
    return `<div class="p-4 text-red-600 bg-red-50 rounded mb-4">
      Error rendering markdown content.
    </div>`;
  }
};
