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
  // Optimize build performance
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build output
  output: 'standalone',
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Faster builds
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

module.exports = nextConfig
