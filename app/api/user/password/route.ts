import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  try {
    // Get user from session
    const userCookie = request.cookies.get("user")
    
    if (!userCookie) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      )
    }

    const userData = JSON.parse(userCookie.value)
    const userId = userData.id

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters long", field: "newPassword" },
        { status: 400 }
      )
    }

    // Fetch current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect", field: "currentPassword" },
        { status: 401 }
      )
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, error: "New password must be different from current password", field: "newPassword" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update password" },
      { status: 500 }
    )
  }
}
