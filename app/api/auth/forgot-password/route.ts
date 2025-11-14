import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex")
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

      // Save token to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })

      // In production, send email here
      // For now, log the reset link
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
      
      console.log("=".repeat(60))
      console.log("PASSWORD RESET REQUEST")
      console.log("=".repeat(60))
      console.log(`Email: ${email}`)
      console.log(`Reset Link: ${resetLink}`)
      console.log(`Token expires in 1 hour`)
      console.log("=".repeat(60))

      // TODO: Send email with reset link
      // await sendPasswordResetEmail(email, resetLink)
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been sent."
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
