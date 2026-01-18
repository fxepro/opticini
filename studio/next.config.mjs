import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors
  },
  webpack: (config, { isServer }) => {
    // Increase memory limit for webpack
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    return config;
  },
  images: {
    unoptimized: true, // Required for Netlify deployment
  },
  // Set turbopack root to avoid workspace inference warnings
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    // Only use rewrites in development - nginx handles routing in production
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    return [
      {
        source: '/api/sitemap',
        destination: 'http://localhost:8000/api/sitemap/',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      // Note: Django admin should be accessed directly at http://localhost:8000/django-admin/
      // to avoid redirect loops. Next.js rewrites don't handle Django's APPEND_SLASH redirects well.
    ];
  },
}

export default nextConfig
