import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  console.log("🧹 Cleaning existing data...")
  await prisma.homeworkSubmission.deleteMany()
  await prisma.homework.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.feePayment.deleteMany()
  await prisma.feeStructure.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.classTeacher.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.parent.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.class.deleteMany()
  await prisma.user.deleteMany()

  const defaultPassword = await hash("password123", 10)

  // Create Admin
  console.log("👤 Creating admin user...")
  const admin = await prisma.user.create({
    data: {
      email: "admin@sar.edu",
      password: defaultPassword,
      fullName: "Dr. Kwame Mensah",
      role: "ADMIN",
      admin: {
        create: {
          department: "Administration",
        },
      },
    },
  })

  // Create Classes
  console.log("🏫 Creating classes...")
  const classes = await Promise.all([
    prisma.class.create({
      data: {
        name: "Primary 1A",
        level: "Primary 1",
        section: "A",
        academicYear: "2024/2025",
      },
    }),
    prisma.class.create({
      data: {
        name: "Primary 2A",
        level: "Primary 2",
        section: "A",
        academicYear: "2024/2025",
      },
    }),
    prisma.class.create({
      data: {
        name: "JHS 1A",
        level: "JHS 1",
        section: "A",
        academicYear: "2024/2025",
      },
    }),
    prisma.class.create({
      data: {
        name: "JHS 2A",
        level: "JHS 2",
        section: "A",
        academicYear: "2024/2025",
      },
    }),
  ])

  // Create Teachers
  console.log("👨‍🏫 Creating teachers...")
  const teachers = await Promise.all([
    prisma.user.create({
      data: {
        email: "teacher1@sar.edu",
        password: defaultPassword,
        fullName: "Mrs. Akosua Boateng",
        role: "TEACHER",
        teacher: {
          create: {
            employeeId: "TCH001",
            subjects: ["Mathematics", "Science"],
            phone: "+233244123456",
          },
        },
      },
      include: { teacher: true },
    }),
    prisma.user.create({
      data: {
        email: "teacher2@sar.edu",
        password: defaultPassword,
        fullName: "Mr. Kofi Asante",
        role: "TEACHER",
        teacher: {
          create: {
            employeeId: "TCH002",
            subjects: ["English", "Social Studies"],
            phone: "+233244123457",
          },
        },
      },
      include: { teacher: true },
    }),
    prisma.user.create({
      data: {
        email: "teacher3@sar.edu",
        password: defaultPassword,
        fullName: "Ms. Ama Owusu",
        role: "TEACHER",
        teacher: {
          create: {
            employeeId: "TCH003",
            subjects: ["Science", "ICT"],
            phone: "+233244123458",
          },
        },
      },
      include: { teacher: true },
    }),
  ])

  // Assign teachers to classes
  console.log("📚 Assigning teachers to classes...")
  await Promise.all([
    prisma.classTeacher.create({
      data: {
        classId: classes[0].id,
        teacherId: teachers[0].teacher!.id,
        subject: "Mathematics",
      },
    }),
    prisma.classTeacher.create({
      data: {
        classId: classes[0].id,
        teacherId: teachers[1].teacher!.id,
        subject: "English",
      },
    }),
    prisma.classTeacher.create({
      data: {
        classId: classes[2].id,
        teacherId: teachers[0].teacher!.id,
        subject: "Mathematics",
      },
    }),
    prisma.classTeacher.create({
      data: {
        classId: classes[2].id,
        teacherId: teachers[2].teacher!.id,
        subject: "Science",
      },
    }),
  ])

  // Create Parents
  console.log("👨‍👩‍👧 Creating parents...")
  const parents = await Promise.all([
    prisma.user.create({
      data: {
        email: "parent1@example.com",
        password: defaultPassword,
        fullName: "Mr. Yaw Mensah",
        role: "PARENT",
        parent: {
          create: {
            phone: "+233244234567",
            occupation: "Business Owner",
          },
        },
      },
      include: { parent: true },
    }),
    prisma.user.create({
      data: {
        email: "parent2@example.com",
        password: defaultPassword,
        fullName: "Mrs. Abena Osei",
        role: "PARENT",
        parent: {
          create: {
            phone: "+233244234568",
            occupation: "Teacher",
          },
        },
      },
      include: { parent: true },
    }),
  ])

  // Create Students
  console.log("👨‍🎓 Creating students...")
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: "student1@sar.edu",
        password: defaultPassword,
        fullName: "Kwame Mensah Jr.",
        role: "STUDENT",
        student: {
          create: {
            rollNumber: "STU001",
            classId: classes[0].id,
            dateOfBirth: new Date("2015-03-15"),
            gender: "Male",
            address: "123 Accra Road, Kumasi",
            phone: "+233244345678",
            parentId: parents[0].parent!.id,
          },
        },
      },
      include: { student: true },
    }),
    prisma.user.create({
      data: {
        email: "student2@sar.edu",
        password: defaultPassword,
        fullName: "Ama Osei",
        role: "STUDENT",
        student: {
          create: {
            rollNumber: "STU002",
            classId: classes[0].id,
            dateOfBirth: new Date("2015-07-22"),
            gender: "Female",
            address: "456 Kumasi Street, Accra",
            phone: "+233244345679",
            parentId: parents[1].parent!.id,
          },
        },
      },
      include: { student: true },
    }),
    prisma.user.create({
      data: {
        email: "student3@sar.edu",
        password: defaultPassword,
        fullName: "Kofi Boateng",
        role: "STUDENT",
        student: {
          create: {
            rollNumber: "STU003",
            classId: classes[2].id,
            dateOfBirth: new Date("2012-11-10"),
            gender: "Male",
            address: "789 Tema Avenue, Kumasi",
            phone: "+233244345680",
            parentId: parents[0].parent!.id,
          },
        },
      },
      include: { student: true },
    }),
  ])

  // Create Attendance Records
  console.log("📅 Creating attendance records...")
  const attendanceRecords = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    for (const student of students) {
      const statuses = ["PRESENT", "PRESENT", "PRESENT", "PRESENT", "ABSENT", "LATE"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      attendanceRecords.push(
        prisma.attendance.create({
          data: {
            studentId: student.student!.id,
            classId: student.student!.classId,
            date,
            status: randomStatus as any,
          },
        })
      )
    }
  }
  await Promise.all(attendanceRecords)

  // Create Homework Assignments
  console.log("📝 Creating homework assignments...")
  const homework = await Promise.all([
    prisma.homework.create({
      data: {
        title: "Mathematics - Chapter 1 Exercises",
        description: "Complete exercises 1-10 from the textbook",
        subject: "Mathematics",
        classId: classes[0].id,
        teacherId: teachers[0].teacher!.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalMarks: 20,
      },
    }),
    prisma.homework.create({
      data: {
        title: "English - Essay Writing",
        description: "Write a 500-word essay on 'My School'",
        subject: "English",
        classId: classes[0].id,
        teacherId: teachers[1].teacher!.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalMarks: 25,
      },
    }),
    prisma.homework.create({
      data: {
        title: "Science - Lab Report",
        description: "Complete the lab report on plant growth",
        subject: "Science",
        classId: classes[2].id,
        teacherId: teachers[2].teacher!.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        totalMarks: 30,
      },
    }),
  ])

  // Create Homework Submissions
  console.log("✍️ Creating homework submissions...")
  await Promise.all([
    prisma.homeworkSubmission.create({
      data: {
        homeworkId: homework[0].id,
        studentId: students[0].student!.id,
        submittedAt: new Date(),
        grade: 18,
        feedback: "Excellent work!",
        status: "GRADED",
      },
    }),
    prisma.homeworkSubmission.create({
      data: {
        homeworkId: homework[0].id,
        studentId: students[1].student!.id,
        submittedAt: new Date(),
        status: "SUBMITTED",
      },
    }),
    prisma.homeworkSubmission.create({
      data: {
        homeworkId: homework[2].id,
        studentId: students[2].student!.id,
        submittedAt: new Date(),
        grade: 27,
        feedback: "Good effort, but needs more detail",
        status: "GRADED",
      },
    }),
  ])

  // Create Grades
  console.log("📊 Creating grades...")
  const subjects = ["Mathematics", "English", "Science", "Social Studies"]
  const gradeRecords = []
  
  for (const student of students) {
    for (const subject of subjects) {
      const marks = 50 + Math.floor(Math.random() * 40) // Random marks between 50-90
      gradeRecords.push(
        prisma.grade.create({
          data: {
            studentId: student.student!.id,
            teacherId: teachers[0].teacher!.id,
            subject,
            examType: "Mid-Term",
            marks,
            totalMarks: 100,
            term: "Term 1",
            academicYear: "2024/2025",
            remarks: marks >= 80 ? "Excellent" : marks >= 60 ? "Good" : "Needs Improvement",
          },
        })
      )
    }
  }
  await Promise.all(gradeRecords)

  // Create Fee Structures
  console.log("💰 Creating fee structures...")
  await Promise.all([
    prisma.feeStructure.create({
      data: {
        className: "Primary 1A",
        academicYear: "2024/2025",
        tuition: 1500,
        textbooks: 200,
        uniform: 150,
        pta: 50,
        other: 100,
        total: 2000,
      },
    }),
    prisma.feeStructure.create({
      data: {
        className: "JHS 1A",
        academicYear: "2024/2025",
        tuition: 2000,
        textbooks: 300,
        uniform: 200,
        pta: 75,
        other: 125,
        total: 2700,
      },
    }),
  ])

  // Create Fee Payments
  console.log("💳 Creating fee payments...")
  await Promise.all([
    prisma.feePayment.create({
      data: {
        studentId: students[0].student!.id,
        amount: 1000,
        paymentDate: new Date("2024-09-01"),
        paymentMethod: "Bank Transfer",
        term: "Term 1",
        academicYear: "2024/2025",
        receiptNumber: "RCP001",
        remarks: "Partial payment",
      },
    }),
    prisma.feePayment.create({
      data: {
        studentId: students[1].student!.id,
        amount: 2000,
        paymentDate: new Date("2024-09-05"),
        paymentMethod: "Cash",
        term: "Term 1",
        academicYear: "2024/2025",
        receiptNumber: "RCP002",
        remarks: "Full payment",
      },
    }),
    prisma.feePayment.create({
      data: {
        studentId: students[2].student!.id,
        amount: 1500,
        paymentDate: new Date("2024-09-10"),
        paymentMethod: "Mobile Money",
        term: "Term 1",
        academicYear: "2024/2025",
        receiptNumber: "RCP003",
        remarks: "Partial payment",
      },
    }),
  ])

  // Create Announcements
  console.log("📢 Creating announcements...")
  await Promise.all([
    prisma.announcement.create({
      data: {
        title: "Welcome to New Academic Year 2024/2025",
        content: "We are excited to welcome all students and parents to the new academic year. Classes begin on September 8th, 2024.",
        targetAudience: "All",
        priority: "High",
        date: new Date("2024-09-01"),
        authorId: admin.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Parent-Teacher Meeting",
        content: "There will be a parent-teacher meeting on October 15th at 2:00 PM. All parents are encouraged to attend.",
        targetAudience: "Parents",
        priority: "Normal",
        date: new Date("2024-10-01"),
        authorId: admin.id,
      },
    }),
    prisma.announcement.create({
      data: {
        title: "Mid-Term Exams Schedule",
        content: "Mid-term examinations will be held from November 10-15. Please ensure students are well prepared.",
        targetAudience: "Students",
        priority: "High",
        date: new Date("2024-10-20"),
        authorId: admin.id,
      },
    }),
  ])

  console.log("\n✅ Seed data created successfully!")
  console.log("\n📊 Summary:")
  console.log(`- Admin: 1`)
  console.log(`- Teachers: ${teachers.length}`)
  console.log(`- Parents: ${parents.length}`)
  console.log(`- Students: ${students.length}`)
  console.log(`- Classes: ${classes.length}`)
  console.log(`- Attendance Records: ${attendanceRecords.length}`)
  console.log(`- Homework Assignments: ${homework.length}`)
  console.log(`- Grades: ${gradeRecords.length}`)
  console.log(`- Fee Payments: 3`)
  console.log(`- Announcements: 3`)
  console.log("\n🔑 Login Credentials:")
  console.log("Admin: admin@sar.edu / password123")
  console.log("Teacher: teacher1@sar.edu / password123")
  console.log("Parent: parent1@example.com / password123")
  console.log("Student: student1@sar.edu / password123")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
