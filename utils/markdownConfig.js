// import { marked } from "marked";

// export const configuredMarked = (content) => {
//   const renderer = new marked.Renderer();

//   // Ensure images use the correct base path
//   renderer.image = function (href, title, text) {
//     // Make sure href is properly formatted
//     const imageSrc = href.startsWith("/") ? href : `/${href}`;
//     return `<img src="${imageSrc}" alt="${text}" title="${
//       title || ""
//     }" class="blog-post-image">`;
//   };

//   return marked(content, { renderer });
// };
// Example of what your markdownConfig.js might need
import { marked } from "marked";

// Configure marked renderer
const renderer = new marked.Renderer();

// Ensure the image renderer outputs proper HTML
renderer.image = function (href, title, text) {
  return `<img class="blog-post-image" loading="lazy" src="${href}" alt="${
    text || "Image"
  }" title="${title || ""}" width="100%" height="auto">`;
};

export const configuredMarked = (markdown) => {
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
};
