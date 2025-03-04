/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will allow the build to succeed even with TypeScript errors
    // You should still fix these errors during development
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
