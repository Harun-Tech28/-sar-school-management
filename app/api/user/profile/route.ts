import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    // Get user from session (stored in cookie or header)
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

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}


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
    const { email, currentPassword } = body

    // Validate input
    if (!email || !currentPassword) {
      return NextResponse.json(
        { success: false, error: "Email and current password are required", field: "email" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format", field: "email" },
        { status: 400 }
      )
    }

    // Fetch current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        role: true,
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

    // Check if email is already taken by another user
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email is already in use", field: "email" },
          { status: 409 }
        )
      }
    }

    // Update email
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    })

    // Update session cookie with new email
    const updatedSession = {
      ...userData,
      email: updatedUser.email,
    }

    const response = NextResponse.json({
      success: true,
      message: "Email updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      },
    })

    // Set updated cookie
    response.cookies.set("user", JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Error updating email:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update email" },
      { status: 500 }
    )
  }
}
