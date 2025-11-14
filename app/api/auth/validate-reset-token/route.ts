import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      )
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token hasn't expired
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        valid: false,
        error: "Invalid or expired reset token"
      })
    }

    return NextResponse.json({
      valid: true
    })
  } catch (error) {
    console.error("Validate reset token error:", error)
    return NextResponse.json(
      { valid: false, error: "Failed to validate token" },
      { status: 500 }
    )
  }
}
