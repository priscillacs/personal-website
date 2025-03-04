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
      console.log("[MARKDOWN-RENDER] Image href:", href, "Type:", typeof href);

      // Handle null or undefined href
      if (!href) {
        console.warn("[MARKDOWN-RENDER] Empty image href detected");
        return `<span class="text-red-500">[Missing image]</span>`;
      }

      // Convert href to string if it's not already one
      let imgSrc = href;
      if (typeof href !== "string") {
        console.warn("[MARKDOWN-RENDER] Non-string href:", href);

        // Try to extract a string path from the object
        if (href && typeof href === "object") {
          if (href.path) {
            imgSrc = href.path;
            console.log("[MARKDOWN-RENDER] Using href.path:", imgSrc);
          } else {
            try {
              // Last resort - stringify the object
              imgSrc = JSON.stringify(href);
              console.log("[MARKDOWN-RENDER] Stringified href:", imgSrc);
            } catch (e) {
              console.error("[MARKDOWN-RENDER] Failed to stringify href:", e);
              return `<span class="text-red-500">[Invalid image: Object used as source]</span>`;
            }
          }
        } else {
          imgSrc = String(href);
          console.log("[MARKDOWN-RENDER] Converted href to string:", imgSrc);
        }
      }

      // Check for [object Object] in the string
      if (imgSrc.includes("[object Object]")) {
        console.warn("[MARKDOWN-RENDER] [object Object] detected in href");
        return `<span class="text-red-500">[Invalid image: Object used as source]</span>`;
      }

      // Ensure path has a leading slash for relative URLs
      if (!imgSrc.startsWith("http") && !imgSrc.startsWith("/")) {
        imgSrc = "/" + imgSrc;
        console.log("[MARKDOWN-RENDER] Added leading slash:", imgSrc);
      }

      // Create the image HTML with proper attributes
      return `<img 
        src="${imgSrc}" 
        alt="${text || "Blog image"}" 
        title="${title || ""}" 
        class="blog-post-image"
        loading="lazy" 
      />`;
    } catch (error) {
      console.error("[MARKDOWN-RENDER] Error rendering image:", error);
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
