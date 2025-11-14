import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get all users and filter by accountStatus
    // Using raw query to bypass Prisma client type issues
    const allUsers: any[] = await prisma.$queryRaw`
      SELECT id, email, "fullName", phone, role, "createdAt", "accountStatus"
      FROM "User"
      WHERE "accountStatus" = 'PENDING'
      ORDER BY "createdAt" DESC
    `

    console.log(`Found ${allUsers.length} pending users`)

    return NextResponse.json({ users: allUsers })
  } catch (error) {
    console.error("Error fetching pending users:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending users", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
