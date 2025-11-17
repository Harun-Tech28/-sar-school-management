import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, middleName, lastName, email, role, password } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !role || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user with ACTIVE status
    const fullName = middleName 
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`

    const roleUpper = role.toUpperCase()

    // Create user with PENDING status (requires admin approval)
    const userId = await prisma.$queryRaw<any>`
      INSERT INTO "User" (id, email, password, "fullName", phone, role, "accountStatus", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${email}, ${hashedPassword}, ${fullName}, '', ${roleUpper}::"Role", 'PENDING'::"AccountStatus", NOW(), NOW())
      RETURNING id
    `
    
    const user = { id: userId[0].id }

    // Note: Role-specific records (Student, Teacher, Parent) will be created when admin approves the registration
    // This prevents incomplete records and ensures proper data setup during approval

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully. Please wait for admin approval before logging in.",
      userId: user.id
    }, { status: 201 })

  } catch (error) {
    console.error("Registration error:", error)
    
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    return NextResponse.json(
      { 
        error: "Registration failed. Please try again.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
