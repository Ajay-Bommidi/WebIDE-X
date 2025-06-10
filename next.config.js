/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/online-code-editor' : '',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since we're using static export
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig 