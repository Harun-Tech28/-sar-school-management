/**
 * Query Optimization Utilities
 * Helps improve database query performance
 */

import { prisma } from './prisma'

// Cache for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

/**
 * Execute a query with caching
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const cached = queryCache.get(key)
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data as T
  }
  
  const data = await queryFn()
  queryCache.set(key, { data, timestamp: Date.now() })
  
  return data
}

/**
 * Clear cache for a specific key or all cache
 */
export function clearCache(key?: string) {
  if (key) {
    queryCache.delete(key)
  } else {
    queryCache.clear()
  }
}

/**
 * Batch multiple queries to reduce round trips
 */
export async function batchQueries<T extends any[]>(
  queries: (() => Promise<any>)[]
): Promise<T> {
  return Promise.all(queries.map(q => q())) as Promise<T>
}

/**
 * Paginate results efficiently
 */
export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: any
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function paginateQuery<T>(
  model: any,
  where: any = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, options.page || 1)
  const limit = Math.min(100, Math.max(1, options.limit || 10))
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy: options.orderBy || { createdAt: 'desc' },
    }),
    model.count({ where }),
  ])

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Optimize includes to only fetch necessary fields
 */
export function selectFields<T extends Record<string, boolean>>(
  fields: T
): { select: T } {
  return { select: fields }
}

/**
 * Create optimized where clause with indexes
 */
export function optimizeWhere(where: any): any {
  // Remove undefined values
  const cleaned = Object.entries(where).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value
    }
    return acc
  }, {} as any)

  return cleaned
}

/**
 * Execute query with timeout
 */
export async function queryWithTimeout<T>(
  queryFn: () => Promise<T>,
  timeout: number = 10000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), timeout)
  })

  return Promise.race([queryFn(), timeoutPromise])
}

/**
 * Batch update/create operations
 */
export async function batchUpsert<T>(
  model: any,
  data: any[],
  batchSize: number = 100
): Promise<T[]> {
  const results: T[] = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(item => model.create({ data: item }))
    )
    results.push(...batchResults)
  }
  
  return results
}

/**
 * Get query performance stats
 */
export function getQueryStats() {
  return {
    cacheSize: queryCache.size,
    cacheKeys: Array.from(queryCache.keys()),
  }
}

/**
 * Warm up cache with frequently accessed data
 */
export async function warmUpCache() {
  try {
    // Cache frequently accessed data
    await cachedQuery('classes', () => 
      prisma.class.findMany({
        select: {
          id: true,
          name: true,
          level: true,
        },
      })
    )

    console.log('✅ Cache warmed up successfully')
  } catch (error) {
    console.error('❌ Cache warm-up failed:', error)
  }
}
