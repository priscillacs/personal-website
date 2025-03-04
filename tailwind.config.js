/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.blue.600"),
              "&:hover": {
                color: theme("colors.blue.700"),
              },
            },
            h1: { color: theme("colors.gray.800"), fontWeight: "700" },
            h2: {
              color: theme("colors.gray.800"),
              fontWeight: "700",
              fontSize: "1.5rem",
              marginTop: "2rem",
              marginBottom: "1rem",
            },
            h3: {
              color: theme("colors.gray.800"),
              fontWeight: "600",
              fontSize: "1.25rem",
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
            },
            h4: { color: theme("colors.gray.800"), fontWeight: "600" },
            blockquote: {
              color: theme("colors.gray.600"),
              borderLeftColor: theme("colors.blue.200"),
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              color: theme("colors.blue.600"),
              fontWeight: "400",
            },
            pre: {
              backgroundColor: theme("colors.gray.800"),
              color: theme("colors.gray.100"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // other plugins
  ],
};
