/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Allow traditional images without width/height
    // Or, instead of unoptimized, you can define domains for remote images:
    // domains: ['yourdomain.com']
  },
};

module.exports = nextConfig;
