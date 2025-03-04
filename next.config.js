/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // During development you can disable TypeScript error checking
    // In production builds, type checking is recommended
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
