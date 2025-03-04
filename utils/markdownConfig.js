import { marked } from "marked";

// Configure marked renderer
const renderer = new marked.Renderer();

// Ensure the image renderer outputs proper HTML
renderer.image = function (href, title, text) {
  return `<img class="blog-post-image" loading="lazy" src="${href}" alt="${
    text || "Image"
  }" title="${title || ""}" width="100%" height="auto">`;
};

// Make sure to export this function properly
export function configuredMarked(markdown) {
  // Set options including the custom renderer
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  });

  return marked(markdown);
}
