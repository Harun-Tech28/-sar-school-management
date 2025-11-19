import { prisma } from "../lib/prisma"

async function verifySystemReady() {
  console.log("🔍 Verifying System Setup...\n")

  try {
    // Check database connection
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Count users by role
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
    const teacherCount = await prisma.user.count({ where: { role: "TEACHER" } })
    const studentCount = await prisma.user.count({ where: { role: "STUDENT" } })
    const parentCount = await prisma.user.count({ where: { role: "PARENT" } })

    console.log("\n📊 User Counts:")
    console.log(`   Admins: ${adminCount}`)
    console.log(`   Teachers: ${teacherCount}`)
    console.log(`   Students: ${studentCount}`)
    console.log(`   Parents: ${parentCount}`)

    // Check classes
    const classCount = await prisma.class.count()
    console.log(`\n📚 Classes: ${classCount}`)

    // Check if students have classes
    const studentsWithoutClass = await prisma.student.count({
      where: { classId: null }
    })
    if (studentsWithoutClass > 0) {
      console.log(`   ⚠️  ${studentsWithoutClass} students without class assignment`)
    } else {
      console.log(`   ✅ All students have classes`)
    }

    // Check if parents have children
    const parentsWithChildren = await prisma.parent.count({
      where: {
        children: {
          some: {}
        }
      }
    })
    console.log(`\n👨‍👩‍👧‍👦 Parents with linked children: ${parentsWithChildren}/${parentCount}`)

    // Check homework
    const homeworkCount = await prisma.homework.count()
    console.log(`\n📝 Homework assignments: ${homeworkCount}`)

    // Check grades
    const gradeCount = await prisma.grade.count()
    console.log(`📊 Grade entries: ${gradeCount}`)

    // Check attendance
    const attendanceCount = await prisma.attendance.count()
    console.log(`✅ Attendance records: ${attendanceCount}`)

    // Check timetable
    const timetableCount = await prisma.timetable.count()
    console.log(`🕐 Timetable entries: ${timetableCount}`)

    // Check announcements
    const announcementCount = await prisma.announcement.count()
    console.log(`📢 Announcements: ${announcementCount}`)

    // System readiness check
    console.log("\n🎯 System Readiness:")
    const issues = []

    if (adminCount === 0) issues.push("No admin users")
    if (teacherCount === 0) issues.push("No teachers")
    if (studentCount === 0) issues.push("No students")
    if (classCount === 0) issues.push("No classes")
    if (studentsWithoutClass > 0) issues.push(`${studentsWithoutClass} students without classes`)

    if (issues.length === 0) {
      console.log("   ✅ System is ready for testing!")
    } else {
      console.log("   ⚠️  Issues found:")
      issues.forEach(issue => console.log(`      - ${issue}`))
      console.log("\n   💡 Run 'npx prisma db seed' to populate test data")
    }

    // Recommendations
    console.log("\n💡 Recommendations:")
    if (homeworkCount === 0) {
      console.log("   - Create some homework assignments for testing")
    }
    if (gradeCount === 0) {
      console.log("   - Enter some grades for report card testing")
    }
    if (attendanceCount === 0) {
      console.log("   - Mark some attendance for testing")
    }
    if (parentCount > 0 && parentsWithChildren === 0) {
      console.log("   - Link children to parent accounts")
    }

    console.log("\n✨ Verification complete!\n")

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifySystemReady()
