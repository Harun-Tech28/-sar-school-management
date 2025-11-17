import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log('[DB Test] Testing database connection...')
    console.log('[DB Test] DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...')
    
    // Test 1: Simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('[DB Test] Connection successful:', result)
    
    // Test 2: Count all users
    const userCount = await prisma.user.count()
    console.log('[DB Test] Total users:', userCount)
    
    // Test 3: Count pending users
    const pendingCount = await prisma.user.count({
      where: { accountStatus: 'PENDING' }
    })
    console.log('[DB Test] Pending users:', pendingCount)
    
    // Test 4: Get pending users
    const pendingUsers = await prisma.user.findMany({
      where: { accountStatus: 'PENDING' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true
      }
    })
    console.log('[DB Test] Pending users list:', pendingUsers)
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      database: process.env.DATABASE_URL?.includes('render') ? 'Render PostgreSQL' : 'Unknown',
      totalUsers: userCount,
      pendingUsers: pendingCount,
      pendingList: pendingUsers
    })
  } catch (error) {
    console.error('[DB Test] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
