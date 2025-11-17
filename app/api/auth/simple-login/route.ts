import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { SignJWT } from "jose"

// Optimized helper function to handle login with timeout
async function handleLoginWithTimeout(email: string, password: string, timeoutMs = 8000) {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Login request timeout')), timeoutMs)
  })

  const loginPromise = async () => {
    // Optimized query - only fetch essential fields
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        role: true,
        accountStatus: true,
        rejectionReason: true,
      },
    })

    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    // Check account status early (before password verification)
    if (user.accountStatus === 'PENDING') {
      throw new Error('ACCOUNT_PENDING')
    }

    if (user.accountStatus === 'REJECTED') {
      const reason = user.rejectionReason || 'No reason provided'
      throw new Error(`ACCOUNT_REJECTED:${reason}`)
    }

    // Verify password
    const isValid = await compare(password, user.password)

    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS')
    }

    return user
  }

  // Race between login and timeout
  return Promise.race([loginPromise(), timeoutPromise])
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log("[simple-login] Starting login process...")
    
    // Parse request body with timeout
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("[simple-login] Login attempt for:", email)

    // Attempt login with timeout
    const user = await handleLoginWithTimeout(email, password, 10000)

    console.log("[simple-login] User authenticated:", user.email, "Role:", user.role)

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "fallback-secret"
    )

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret)

    // Create response with cookie (normalize role to lowercase for routing)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.toLowerCase(),
      },
    })

    // Set cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    const duration = Date.now() - startTime
    console.log(`[simple-login] ✅ Login successful for: ${user.email} (${duration}ms)`)
    
    return response
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    console.error(`[simple-login] ❌ Login failed (${duration}ms):`, errorMessage)

    // Handle specific error types
    if (errorMessage === 'INVALID_CREDENTIALS') {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    if (errorMessage === 'ACCOUNT_PENDING') {
      return NextResponse.json(
        { error: "Your account is pending admin approval. Please wait for approval before logging in." },
        { status: 403 }
      )
    }

    if (errorMessage.startsWith('ACCOUNT_REJECTED:')) {
      const reason = errorMessage.split(':')[1]
      return NextResponse.json(
        { error: `Your account was rejected. Reason: ${reason}` },
        { status: 403 }
      )
    }

    if (errorMessage === 'Login request timeout') {
      return NextResponse.json(
        { 
          error: "Login timeout. Please check your database connection and try again.",
          code: "TIMEOUT"
        },
        { status: 504 }
      )
    }

    // Database connection errors
    if (errorMessage.includes('connection') || errorMessage.includes('timeout')) {
      return NextResponse.json(
        { 
          error: "Database connection error. Please try again in a moment.",
          code: "DB_CONNECTION_ERROR"
        },
        { status: 503 }
      )
    }

    // Generic error
    return NextResponse.json(
      { 
        error: "An error occurred during login. Please try again.",
        code: "LOGIN_ERROR"
      },
      { status: 500 }
    )
  }
}
