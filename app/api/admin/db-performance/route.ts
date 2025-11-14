import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getQueryStats, getSlowQueries, exportQueryLogs } from '@/lib/db-monitor'

export async function GET() {
  try {
    const start = Date.now()
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    const connectionTime = Date.now() - start

    // Get query statistics
    const queryStats = getQueryStats()
    const slowQueries = getSlowQueries()

    // Check connection pool status
    const poolStatus = {
      connectionTime: `${connectionTime}ms`,
      status: connectionTime < 100 ? 'EXCELLENT' : 
              connectionTime < 500 ? 'GOOD' : 
              connectionTime < 1000 ? 'SLOW' : 'CRITICAL',
    }

    // Get database size (if available)
    let dbSize = null
    try {
      const sizeResult = await prisma.$queryRaw<any[]>`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `
      dbSize = sizeResult[0]?.size || 'Unknown'
    } catch (error) {
      dbSize = 'Not available'
    }

    // Get table counts
    const tableCounts = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.attendance.count(),
      prisma.grade.count(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        connection: poolStatus,
        database: {
          size: dbSize,
          tables: {
            users: tableCounts[0],
            students: tableCounts[1],
            teachers: tableCounts[2],
            classes: tableCounts[3],
            attendance: tableCounts[4],
            grades: tableCounts[5],
          },
        },
        queries: {
          stats: queryStats,
          slowQueries: slowQueries.length,
          slowQueriesList: slowQueries.slice(0, 5), // Top 5 slow queries
        },
        recommendations: getRecommendations(connectionTime, slowQueries.length),
      },
    })
  } catch (error) {
    console.error('Database performance check failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check database performance',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

function getRecommendations(connectionTime: number, slowQueryCount: number): string[] {
  const recommendations: string[] = []

  if (connectionTime > 1000) {
    recommendations.push('⚠️ Connection time is very slow. Check your database connection string and network.')
  } else if (connectionTime > 500) {
    recommendations.push('⚠️ Connection time is slow. Consider using connection pooling.')
  }

  if (slowQueryCount > 10) {
    recommendations.push('⚠️ Many slow queries detected. Consider adding database indexes.')
  } else if (slowQueryCount > 5) {
    recommendations.push('⚠️ Some slow queries detected. Review query optimization.')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Database performance is good!')
  }

  return recommendations
}
