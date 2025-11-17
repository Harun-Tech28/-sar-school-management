import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    // Get the user to check their role
    const user: any = await prisma.$queryRaw`
      SELECT id, email, "fullName", role, "accountStatus", "firstName", "lastName"
      FROM "User"
      WHERE id = ${userId}
    `

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userData = user[0]

    // Check if already approved
    if (userData.accountStatus === 'ACTIVE') {
      return NextResponse.json(
        { error: "User is already approved" },
        { status: 400 }
      )
    }

    // Update user status to ACTIVE
    await prisma.$executeRaw`
      UPDATE "User"
      SET "accountStatus" = 'ACTIVE', "approvedAt" = NOW()
      WHERE id = ${userId}
    `

    // Create role-specific records based on user role
    const roleUpper = userData.role.toUpperCase()

    if (roleUpper === "STUDENT") {
      // Check if student record already exists
      const existingStudent = await prisma.student.findUnique({
        where: { userId }
      })

      if (!existingStudent) {
        // Generate a unique roll number
        const studentCount = await prisma.student.count()
        const rollNumber = `STU${new Date().getFullYear()}${String(studentCount + 1).padStart(4, '0')}`
        
        // Get first available class or create a default one
        let defaultClass = await prisma.class.findFirst()
        if (!defaultClass) {
          defaultClass = await prisma.class.create({
            data: {
              name: "Unassigned",
              form: "General",
              room: "TBA",
              capacity: 100,
            }
          })
        }

        await prisma.$executeRaw`
          INSERT INTO "Student" (id, "userId", "rollNumber", "classId", "dateOfBirth", gender, address, "admissionType", status, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${userId}, ${rollNumber}, ${defaultClass.id}, NOW(), 'Not Specified', 'To be updated', 'NEW', 'ACTIVE', NOW(), NOW())
        `
      }
    } else if (roleUpper === "TEACHER") {
      // Check if teacher record already exists
      const existingTeacher = await prisma.teacher.findUnique({
        where: { userId }
      })

      if (!existingTeacher) {
        // Generate employee ID
        const teacherCount = await prisma.teacher.count()
        const employeeId = `TCH${new Date().getFullYear()}${String(teacherCount + 1).padStart(4, '0')}`

        await prisma.$executeRaw`
          INSERT INTO "Teacher" (id, "userId", "employeeId", subject, subjects, "joinDate", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${userId}, ${employeeId}, 'General', ARRAY[]::text[], NOW(), NOW(), NOW())
        `
      }
    } else if (roleUpper === "PARENT") {
      // Check if parent record already exists
      const existingParent = await prisma.parent.findUnique({
        where: { userId }
      })

      if (!existingParent) {
        await prisma.$executeRaw`
          INSERT INTO "Parent" (id, "userId", phone, address, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${userId}, '', '', NOW(), NOW())
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: `${userData.fullName || 'User'} has been approved successfully`,
      user: userData
    })
  } catch (error) {
    console.error("Error approving user:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to approve user", details: errorMessage },
      { status: 500 }
    )
  }
}
