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

    // Use raw SQL to create user and role-specific records
    const userId = await prisma.$queryRaw<any>`
      INSERT INTO "User" (id, email, password, "fullName", phone, role, "accountStatus", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${email}, ${hashedPassword}, ${fullName}, '', ${roleUpper}::"Role", 'ACTIVE'::"AccountStatus", NOW(), NOW())
      RETURNING id
    `
    
    const user = { id: userId[0].id }

    // Create role-specific records
    if (roleUpper === "STUDENT") {
      // Generate a unique roll number
      const studentCount = await prisma.student.count()
      const rollNumber = `STU${new Date().getFullYear()}${String(studentCount + 1).padStart(4, '0')}`
      
      // Get first available class or create a default one
      let defaultClass = await prisma.class.findFirst()
      if (!defaultClass) {
        // Create a default class if none exists
        defaultClass = await prisma.class.create({
          data: {
            name: "Unassigned",
            form: "General",
            room: "TBA",
            capacity: 100,
          }
        })
      }

      await prisma.$queryRaw`
        INSERT INTO "Student" (id, "userId", "rollNumber", "classId", "dateOfBirth", gender, address, "admissionType", status, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${user.id}, ${rollNumber}, ${defaultClass.id}, NOW(), 'Not Specified', 'To be updated', 'NEW', 'ACTIVE', NOW(), NOW())
      `
    } else if (roleUpper === "TEACHER") {
      // Generate employee ID
      const teacherCount = await prisma.teacher.count()
      const employeeId = `TCH${new Date().getFullYear()}${String(teacherCount + 1).padStart(4, '0')}`

      await prisma.$queryRaw`
        INSERT INTO "Teacher" (id, "userId", "employeeId", subject, subjects, "joinDate", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${user.id}, ${employeeId}, 'General', ARRAY[]::text[], NOW(), NOW(), NOW())
      `
    } else if (roleUpper === "PARENT") {
      await prisma.$queryRaw`
        INSERT INTO "Parent" (id, "userId", phone, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${user.id}, '', NOW(), NOW())
      `
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! You can now login with your credentials.",
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
