import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Validate DATABASE_URL exists (skip during build)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

if (!process.env.DATABASE_URL && !isBuildTime) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create Prisma client with optimized production settings
// Note: Connection pooling is configured via DATABASE_URL connection string parameters
// Example: postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=10
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
    }
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Test connection on startup (skip during build)
if (!isBuildTime) {
  prisma.$connect()
    .then(() => console.log('✅ Prisma connected to database'))
    .catch((error) => console.error('❌ Prisma connection failed:', error))
}

// Connection with retry logic and timeout
export async function connectDB(retries = 3, timeout = 5000): Promise<PrismaClient> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), timeout)
      })

      // Race between connection and timeout
      await Promise.race([
        prisma.$connect(),
        timeoutPromise
      ])

      console.log('✅ Database connected successfully')
      return prisma
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`❌ Database connection attempt ${attempt}/${retries} failed:`, errorMessage)
      
      if (attempt === retries) {
        console.error('❌ All database connection attempts failed')
        throw new Error(`Database connection failed after ${retries} attempts: ${errorMessage}`)
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
      console.log(`⏳ Retrying in ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw new Error('Database connection failed')
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}
