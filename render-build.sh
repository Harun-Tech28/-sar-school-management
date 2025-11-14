#!/usr/bin/env bash
# Render build script for faster deployments

set -e

echo "🚀 Starting optimized build process..."

# Install dependencies with frozen lockfile (faster)
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Build Next.js application
echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
