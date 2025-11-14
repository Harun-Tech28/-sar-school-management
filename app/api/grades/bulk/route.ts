import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/grades/bulk - Create multiple grade entries at once
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grades } = body

    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return NextResponse.json(
        { success: false, error: "Grades array is required" },
        { status: 400 }
      )
    }

    const results = {
      created: 0,
      failed: [] as any[],
    }

    // Process each grade in a transaction
    for (const gradeData of grades) {
      try {
        const {
          studentId,
          teacherId,
          subject,
          examType,
          marks,
          totalMarks,
          term,
          academicYear,
          remarks,
        } = gradeData

        // Validation
        if (!studentId || !teacherId || !subject || !examType) {
          results.failed.push({
            data: gradeData,
            error: "Student, teacher, subject, and exam type are required",
          })
          continue
        }

        if (marks === undefined || marks === null) {
          results.failed.push({
            data: gradeData,
            error: "Marks are required",
          })
          continue
        }

        if (marks < 0) {
          results.failed.push({
            data: gradeData,
            error: "Marks must be a positive number",
          })
          continue
        }

        if (marks > totalMarks) {
          results.failed.push({
            data: gradeData,
            error: "Marks cannot exceed total marks",
          })
          continue
        }

        if (!term || !academicYear) {
          results.failed.push({
            data: gradeData,
            error: "Term and academic year are required",
          })
          continue
        }

        // Check for duplicate grade
        const existingGrade = await prisma.grade.findFirst({
          where: {
            studentId,
            subject,
            examType,
            term,
            academicYear,
          },
        })

        if (existingGrade) {
          // Update existing grade instead of creating duplicate
          await prisma.grade.update({
            where: { id: existingGrade.id },
            data: {
              marks: parseFloat(marks),
              totalMarks: parseFloat(totalMarks),
              remarks: remarks || null,
              teacherId,
            },
          })
          results.created++
        } else {
          // Create new grade
          await prisma.grade.create({
            data: {
              studentId,
              teacherId,
              subject,
              examType,
              marks: parseFloat(marks),
              totalMarks: parseFloat(totalMarks),
              term,
              academicYear,
              remarks: remarks || null,
            },
          })
          results.created++
        }
      } catch (error) {
        console.error("[grades/bulk] Error processing grade:", error)
        results.failed.push({
          data: gradeData,
          error: "Failed to process grade",
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("[grades/bulk] POST error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create grades" },
      { status: 500 }
    )
  }
}
