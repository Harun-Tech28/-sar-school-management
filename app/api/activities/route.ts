import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface Activity {
  id: string
  icon: string
  description: string
  timestamp: number
  color: string
  category: string
  actionUrl?: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role") || "admin"
    const limit = parseInt(searchParams.get("limit") || "10")

    const activities: Activity[] = []

    // 1. Recent Homework Assignments
    const recentHomework = await prisma.homework.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        dueDate: true,
        class: {
          select: { name: true }
        },
        teacher: {
          select: {
            user: { select: { fullName: true } }
          }
        }
      }
    })

    recentHomework.forEach(hw => {
      const daysUntilDue = Math.ceil((hw.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      activities.push({
        id: `homework_${hw.id}`,
        icon: "📝",
        description: `${hw.teacher.user.fullName} assigned "${hw.title}" to ${hw.class.name} (Due in ${daysUntilDue} days)`,
        timestamp: hw.createdAt.getTime(),
        color: "blue",
        category: "Academic",
        actionUrl: role === "teacher" ? "/dashboard/teacher/homework" : "/dashboard/admin/homework"
      })
    })

    // 2. Recent Student Registrations
    const recentStudents = await prisma.student.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        user: { select: { fullName: true } },
        class: { select: { name: true } }
      }
    })

    recentStudents.forEach(student => {
      activities.push({
        id: `student_${student.id}`,
        icon: "👨‍🎓",
        description: `New student ${student.user.fullName} enrolled in ${student.class?.name || "a class"}`,
        timestamp: student.createdAt.getTime(),
        color: "green",
        category: "Enrollment",
        actionUrl: "/dashboard/admin/students"
      })
    })

    // 3. Recent Attendance (Daily Summary)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayAttendance = await prisma.attendance.groupBy({
      by: ['classId', 'status'],
      where: {
        date: {
          gte: today
        }
      },
      _count: true
    })

    if (todayAttendance.length > 0) {
      const presentCount = todayAttendance
        .filter(a => a.status === 'PRESENT')
        .reduce((sum, a) => sum + a._count, 0)
      
      const totalCount = todayAttendance.reduce((sum, a) => sum + a._count, 0)
      
      activities.push({
        id: `attendance_today`,
        icon: "✅",
        description: `Today's attendance: ${presentCount}/${totalCount} students present (${Math.round((presentCount/totalCount) * 100)}%)`,
        timestamp: Date.now(),
        color: "green",
        category: "Attendance",
        actionUrl: "/dashboard/admin/attendance"
      })
    }

    // 4. Recent Exam Results Posted
    const recentGrades = await prisma.grade.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        subject: true,
        examType: true,
        teacher: {
          select: { 
            user: { select: { fullName: true } }
          }
        },
        student: {
          select: {
            class: { select: { name: true } }
          }
        }
      }
    })

    recentGrades.forEach(grade => {
      activities.push({
        id: `grade_${grade.id}`,
        icon: "📊",
        description: `${grade.teacher.user.fullName} posted ${grade.subject} ${grade.examType} results for ${grade.student.class?.name}`,
        timestamp: grade.createdAt.getTime(),
        color: "purple",
        category: "Academic",
        actionUrl: role === "teacher" ? "/dashboard/teacher/grades" : "/dashboard/admin/exams"
      })
    })

    // 5. Recent Fee Payments
    const recentPayments = await prisma.feePayment.findMany({
      take: 2,
      orderBy: { paymentDate: "desc" },
      select: {
        id: true,
        paymentDate: true,
        amount: true,
        student: {
          select: { 
            user: { select: { fullName: true } }
          }
        }
      }
    })

    recentPayments.forEach(payment => {
      activities.push({
        id: `payment_${payment.id}`,
        icon: "💰",
        description: `${payment.student.user.fullName} paid GHS ${payment.amount.toFixed(2)} in school fees`,
        timestamp: payment.paymentDate.getTime(),
        color: "yellow",
        category: "Finance",
        actionUrl: "/dashboard/admin/fee-management"
      })
    })

    // 6. Recent Announcements
    const recentAnnouncements = await prisma.announcement.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        priority: true
      }
    })

    recentAnnouncements.forEach(announcement => {
      const priorityEmoji = announcement.priority === "HIGH" ? "🔴" : announcement.priority === "MEDIUM" ? "🟡" : "🔵"
      activities.push({
        id: `announcement_${announcement.id}`,
        icon: "📢",
        description: `${priorityEmoji} New announcement: ${announcement.title}`,
        timestamp: announcement.createdAt.getTime(),
        color: announcement.priority === "HIGH" ? "red" : "orange",
        category: "Communication",
        actionUrl: role === "teacher" ? "/dashboard/teacher/announcements" : "/dashboard/admin/announcements"
      })
    })

    // 7. Recent Teacher Activities
    const recentTeachers = await prisma.teacher.findMany({
      take: 1,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        user: { select: { fullName: true } },
        subject: true
      }
    })

    recentTeachers.forEach(teacher => {
      activities.push({
        id: `teacher_${teacher.id}`,
        icon: "👨‍🏫",
        description: `New teacher ${teacher.user.fullName} joined (${teacher.subject})`,
        timestamp: teacher.createdAt.getTime(),
        color: "blue",
        category: "Staff",
        actionUrl: "/dashboard/admin/teachers"
      })
    })

    // 8. Upcoming Exams (within next 7 days)
    const upcomingExams = await prisma.exam.findMany({
      where: {
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      take: 2,
      orderBy: { date: "asc" },
      select: {
        id: true,
        name: true,
        date: true,
        class: { select: { name: true } }
      }
    })

    upcomingExams.forEach(exam => {
      const daysUntil = Math.ceil((exam.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      activities.push({
        id: `exam_${exam.id}`,
        icon: "📝",
        description: `Upcoming: ${exam.name} for ${exam.class.name} in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
        timestamp: Date.now() - 1000, // Recent but not newest
        color: "purple",
        category: "Academic",
        actionUrl: "/dashboard/admin/exams"
      })
    })

    // 9. Recent Homework Submissions
    const recentSubmissions = await prisma.homeworkSubmission.findMany({
      take: 2,
      orderBy: { submittedAt: "desc" },
      where: {
        submittedAt: { not: null }
      },
      select: {
        id: true,
        submittedAt: true,
        student: {
          select: {
            user: { select: { fullName: true } }
          }
        },
        homework: {
          select: {
            title: true,
            class: { select: { name: true } }
          }
        }
      }
    })

    recentSubmissions.forEach(submission => {
      if (submission.submittedAt) {
        activities.push({
          id: `submission_${submission.id}`,
          icon: "✍️",
          description: `${submission.student.user.fullName} submitted "${submission.homework.title}"`,
          timestamp: submission.submittedAt.getTime(),
          color: "green",
          category: "Academic",
          actionUrl: role === "teacher" ? "/dashboard/teacher/homework" : "/dashboard/admin/homework"
        })
      }
    })

    // Sort by timestamp (newest first) and limit
    const sortedActivities = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: sortedActivities,
      categories: ["All", "Academic", "Finance", "Attendance", "Communication", "Enrollment", "Staff"]
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
