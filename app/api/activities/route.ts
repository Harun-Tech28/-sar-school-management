import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface Activity {
  id: string
  icon: string
  description: string
  timestamp: number
  color: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role") || "admin"
    const limit = parseInt(searchParams.get("limit") || "10")

    // Fetch recent activities from various sources
    const activities: Activity[] = []

    // Recent student registrations
    const recentStudents = await prisma.student.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        user: {
          select: { fullName: true }
        },
        class: {
          select: { name: true }
        }
      }
    })

    recentStudents.forEach(student => {
      activities.push({
        id: `student_${student.createdAt.getTime()}`,
        icon: "👨‍🎓",
        description: `${student.user.fullName} registered for ${student.class?.name || "a class"}`,
        timestamp: student.createdAt.getTime(),
        color: "blue"
      })
    })

    // Recent attendance records
    const recentAttendance = await prisma.attendance.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      where: {
        status: "PRESENT"
      },
      select: {
        createdAt: true,
        classId: true
      }
    })

    // Get class names for attendance records
    for (const record of recentAttendance) {
      const classInfo = await prisma.class.findUnique({
        where: { id: record.classId }
      })

      activities.push({
        id: `attendance_${record.createdAt.getTime()}`,
        icon: "✅",
        description: `Attendance marked for ${classInfo?.name || "class"}`,
        timestamp: record.createdAt.getTime(),
        color: "green"
      })
    }

    // Recent exam results
    const recentGrades = await prisma.grade.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        subject: true,
        examType: true,
        teacher: {
          select: { 
            user: {
              select: { fullName: true }
            }
          }
        },
        student: {
          select: {
            class: {
              select: { name: true }
            }
          }
        }
      }
    })

    recentGrades.forEach(grade => {
      activities.push({
        id: `grade_${grade.createdAt.getTime()}`,
        icon: "📊",
        description: `${grade.teacher.user.fullName} posted ${grade.subject} ${grade.examType} results for ${grade.student.class?.name || "class"}`,
        timestamp: grade.createdAt.getTime(),
        color: "purple"
      })
    })

    // Recent fee payments
    const recentPayments = await prisma.feePayment.findMany({
      take: 3,
      orderBy: { paymentDate: "desc" },
      select: {
        paymentDate: true,
        amount: true,
        student: {
          select: { 
            user: {
              select: { fullName: true }
            }
          }
        }
      }
    })

    recentPayments.forEach(payment => {
      activities.push({
        id: `payment_${payment.paymentDate.getTime()}`,
        icon: "💰",
        description: `${payment.student.user.fullName} paid term fees (GHS ${payment.amount.toFixed(2)})`,
        timestamp: payment.paymentDate.getTime(),
        color: "yellow"
      })
    })

    // Recent announcements
    const recentAnnouncements = await prisma.announcement.findMany({
      take: 2,
      orderBy: { createdAt: "desc" }
    })

    recentAnnouncements.forEach(announcement => {
      activities.push({
        id: `announcement_${announcement.createdAt.getTime()}`,
        icon: "📢",
        description: `New announcement: ${announcement.title}`,
        timestamp: announcement.createdAt.getTime(),
        color: "orange"
      })
    })

    // Sort by timestamp (newest first) and limit
    const sortedActivities = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: sortedActivities
    })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch activities"
      },
      { status: 500 }
    )
  }
}
