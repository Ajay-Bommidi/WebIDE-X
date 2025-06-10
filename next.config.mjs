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
  basePath: '/Online-Code-Editor',  // Your repository name
  assetPrefix: '/Online-Code-Editor/',  // Your repository name
  // Disable server-side features since we're doing static export
  experimental: {
    appDir: true,
  },
}

export default nextConfig
