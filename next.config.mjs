/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export', // Enables static HTML export for GitHub Pages
  // You might need to set a base path if your GitHub Pages URL includes a repository name (e.g., /your-repo-name)
  // basePath: process.env.NODE_ENV === 'production' ? '/online-code-editor' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/online-code-editor/' : '',
}

export default nextConfig
