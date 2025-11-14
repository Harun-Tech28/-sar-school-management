import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const bulkAttendanceSchema = z.object({
  classId: z.string().min(1),
  date: z.string(),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
      remarks: z.string().optional(),
    })
  ),
})

// POST /api/attendance/bulk - Mark attendance for multiple students
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = bulkAttendanceSchema.parse(body)

    const date = new Date(data.date)

    // Check if any attendance already exists for this date
    const existing = await prisma.attendance.findMany({
      where: {
        classId: data.classId,
        date,
      },
    })

    let created = 0
    let updated = 0

    // Process each record - update if exists, create if not
    for (const record of data.records) {
      const existingRecord = existing.find(e => e.studentId === record.studentId)
      
      if (existingRecord) {
        // Update existing record
        await prisma.attendance.update({
          where: { id: existingRecord.id },
          data: {
            status: record.status,
            remarks: record.remarks,
          },
        })
        updated++
      } else {
        // Create new record
        await prisma.attendance.create({
          data: {
            studentId: record.studentId,
            classId: data.classId,
            date,
            status: record.status,
            remarks: record.remarks,
          },
        })
        created++
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Attendance saved successfully. Created: ${created}, Updated: ${updated}`,
        created,
        updated,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[attendance/bulk] POST error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to mark bulk attendance" },
      { status: 500 }
    )
  }
}
