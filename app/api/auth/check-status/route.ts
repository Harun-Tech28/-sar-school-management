import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        accountStatus: true,
        rejectionReason: true,
        createdAt: true,
        approvedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "No registration found with this email"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        rejectionReason: user.rejectionReason,
        createdAt: user.createdAt,
        approvedAt: user.approvedAt
      }
    })
  } catch (error) {
    console.error("[check-status] Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check registration status" },
      { status: 500 }
    )
  }
}
