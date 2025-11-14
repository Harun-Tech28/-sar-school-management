/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip database connection during build
  env: {
    SKIP_ENV_VALIDATION: 'true',
  },
  // Handle images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Strict type checking
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
