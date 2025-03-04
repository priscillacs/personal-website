import { marked } from "marked";

// Create custom renderer
export function configureMarkdownRenderer() {
  const renderer = new marked.Renderer();

  // Store the original image renderer
  const originalImageRenderer = renderer.image;

  // Override the image renderer
  renderer.image = function (href, title, text) {
    // Generate the basic image HTML
    let img = originalImageRenderer.call(this, href, title, text);

    // Add width and height attributes if not already present
    if (!img.includes("width=") && !img.includes("height=")) {
      img = img.replace("<img", '<img width="100%" height="auto"');
    }

    // Add loading="lazy" for better performance
    if (!img.includes("loading=")) {
      img = img.replace("<img", '<img loading="lazy"');
    }

    // Add class for styling if needed
    img = img.replace("<img", '<img class="blog-post-image"');

    return img;
  };

  // Configure marked with our custom renderer
  marked.setOptions({
    renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: false,
    sanitize: false,
    smartypants: true, // Pretty quotes, ellipses, etc.
  });

  return marked;
}

// Export configured marked instance
export const configuredMarked = configureMarkdownRenderer();

// Export the main marked function as well
export default marked;
