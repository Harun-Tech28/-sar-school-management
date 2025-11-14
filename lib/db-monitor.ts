/**
 * Database Performance Monitoring
 * Track and log slow queries
 */

interface QueryLog {
  query: string
  duration: number
  timestamp: number
}

const queryLogs: QueryLog[] = []
const SLOW_QUERY_THRESHOLD = 1000 // 1 second
const MAX_LOGS = 100

/**
 * Log a query execution
 */
export function logQuery(query: string, duration: number) {
  const log: QueryLog = {
    query,
    duration,
    timestamp: Date.now(),
  }

  queryLogs.push(log)

  // Keep only recent logs
  if (queryLogs.length > MAX_LOGS) {
    queryLogs.shift()
  }

  // Warn about slow queries
  if (duration > SLOW_QUERY_THRESHOLD) {
    console.warn(`⚠️ Slow query detected (${duration}ms):`, query.substring(0, 100))
  }
}

/**
 * Measure query execution time
 */
export async function measureQuery<T>(
  name: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = Date.now()
  
  try {
    const result = await queryFn()
    const duration = Date.now() - start
    
    logQuery(name, duration)
    
    return result
  } catch (error) {
    const duration = Date.now() - start
    logQuery(`${name} (ERROR)`, duration)
    throw error
  }
}

/**
 * Get slow queries
 */
export function getSlowQueries(threshold: number = SLOW_QUERY_THRESHOLD): QueryLog[] {
  return queryLogs.filter(log => log.duration > threshold)
}

/**
 * Get query statistics
 */
export function getQueryStats() {
  if (queryLogs.length === 0) {
    return {
      total: 0,
      average: 0,
      slowest: null,
      fastest: null,
    }
  }

  const durations = queryLogs.map(log => log.duration)
  const total = queryLogs.length
  const average = durations.reduce((a, b) => a + b, 0) / total
  const slowest = queryLogs.reduce((a, b) => a.duration > b.duration ? a : b)
  const fastest = queryLogs.reduce((a, b) => a.duration < b.duration ? a : b)

  return {
    total,
    average: Math.round(average),
    slowest: {
      query: slowest.query,
      duration: slowest.duration,
    },
    fastest: {
      query: fastest.query,
      duration: fastest.duration,
    },
  }
}

/**
 * Clear query logs
 */
export function clearQueryLogs() {
  queryLogs.length = 0
}

/**
 * Export query logs for analysis
 */
export function exportQueryLogs() {
  return {
    logs: [...queryLogs],
    stats: getQueryStats(),
    slowQueries: getSlowQueries(),
  }
}
