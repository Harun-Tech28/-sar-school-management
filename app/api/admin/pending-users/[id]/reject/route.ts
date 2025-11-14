import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const body = await request.json()
    const { reason } = body

    // Update user status to REJECTED using raw SQL
    await prisma.$executeRaw`
      UPDATE "User"
      SET "accountStatus" = 'REJECTED', "rejectionReason" = ${reason || "No reason provided"}
      WHERE id = ${userId}
    `

    // Get the updated user
    const user: any = await prisma.$queryRaw`
      SELECT id, email, "fullName", role, "accountStatus"
      FROM "User"
      WHERE id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: `${user[0]?.fullName || 'User'} has been rejected`,
      user: user[0]
    })
  } catch (error) {
    console.error("Error rejecting user:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to reject user", details: errorMessage },
      { status: 500 }
    )
  }
}
