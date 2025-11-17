import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Debug endpoint to see all users and their statuses
export async function GET() {
  try {
    const allUsers: any[] = await prisma.$queryRaw`
      SELECT id, email, "fullName", role, "accountStatus", "createdAt"
      FROM "User"
      ORDER BY "createdAt" DESC
      LIMIT 20
    `

    const statusCounts: any[] = await prisma.$queryRaw`
      SELECT "accountStatus", COUNT(*) as count
      FROM "User"
      GROUP BY "accountStatus"
    `

    return NextResponse.json({
      success: true,
      users: allUsers,
      statusCounts: statusCounts,
      message: "This endpoint shows all users and their account statuses for debugging"
    })
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json(
      { error: "Failed to fetch users", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
