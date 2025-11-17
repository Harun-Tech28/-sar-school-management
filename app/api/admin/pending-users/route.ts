import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log('[pending-users API] Request received')
    
    // Get all users with PENDING status
    const pendingUsers: any[] = await prisma.$queryRaw`
      SELECT id, email, "fullName", "firstName", "lastName", phone, role, "createdAt", "accountStatus"
      FROM "User"
      WHERE "accountStatus" = 'PENDING'
      ORDER BY "createdAt" DESC
    `

    console.log(`[pending-users API] Found ${pendingUsers.length} pending users`)
    console.log('[pending-users API] Users:', JSON.stringify(pendingUsers, null, 2))

    // For debugging: also log total user count
    const totalUsers: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "User"
    `
    console.log(`[pending-users API] Total users in database: ${totalUsers[0]?.count || 0}`)

    const response = { 
      success: true,
      users: pendingUsers,
      count: pendingUsers.length
    }
    
    console.log('[pending-users API] Sending response:', JSON.stringify(response, null, 2))

    return NextResponse.json(response)
  } catch (error) {
    console.error("[pending-users API] Error fetching pending users:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch pending users", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
