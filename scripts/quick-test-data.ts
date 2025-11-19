import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function createQuickTestData() {
  console.log("🚀 Creating quick test data...\n")

  try {
    // Create admin if doesn't exist
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    })

    if (!adminExists) {
      console.log("Creating admin user...")
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await prisma.user.create({
        data: {
          email: "admin@school.com",
          password: hashedPassword,
          fullName: "System Administrator",
          role: "ADMIN",
          isApproved: true
        }
      })
      console.log("✅ Admin created: admin@school.com / admin123")
    }

    // Create a test class if none exist
    const classCount = await prisma.class.count()
    if (classCount === 0) {
      console.log("\nCreating test classes...")
      await prisma.class.createMany({
        data: [
          { name: "Class 1", level: "PRIMARY", capacity: 30 },
          { name: "Class 2", level: "PRIMARY", capacity: 30 },
          { name: "Class 3", level: "PRIMARY", capacity: 30 }
        ]
      })
      console.log("✅ Created 3 test classes")
    }

    // Create a test teacher
    const teacherExists = await prisma.user.findFirst({
      where: { role: "TEACHER" }
    })

    if (!teacherExists) {
      console.log("\nCreating test teacher...")
      const hashedPassword = await bcrypt.hash("teacher123", 10)
      const teacherUser = await prisma.user.create({
        data: {
          email: "teacher@school.com",
          password: hashedPassword,
          fullName: "John Teacher",
          role: "TEACHER",
          isApproved: true
        }
      })

      await prisma.teacher.create({
        data: {
          userId: teacherUser.id,
          subject: "Mathematics",
          qualification: "B.Ed",
          experience: 5
        }
      })
      console.log("✅ Teacher created: teacher@school.com / teacher123")
    }

    // Create test students
    const studentCount = await prisma.student.count()
    if (studentCount === 0) {
      console.log("\nCreating test students...")
      const classes = await prisma.class.findMany({ take: 3 })
      
      for (let i = 1; i <= 5; i++) {
        const hashedPassword = await bcrypt.hash("student123", 10)
        const studentUser = await prisma.user.create({
          data: {
            email: `student${i}@school.com`,
            password: hashedPassword,
            fullName: `Student ${i}`,
            role: "STUDENT",
            isApproved: true
          }
        })

        await prisma.student.create({
          data: {
            userId: studentUser.id,
            rollNumber: `STU${String(i).padStart(3, '0')}`,
            classId: classes[i % classes.length].id,
            dateOfBirth: new Date(2010, 0, i),
            gender: i % 2 === 0 ? "MALE" : "FEMALE",
            admissionDate: new Date()
          }
        })
      }
      console.log("✅ Created 5 test students")
    }

    // Create a test parent
    const parentExists = await prisma.user.findFirst({
      where: { role: "PARENT" }
    })

    if (!parentExists) {
      console.log("\nCreating test parent...")
      const hashedPassword = await bcrypt.hash("parent123", 10)
      const parentUser = await prisma.user.create({
        data: {
          email: "parent@school.com",
          password: hashedPassword,
          fullName: "Parent User",
          role: "PARENT",
          isApproved: true
        }
      })

      const firstStudent = await prisma.student.findFirst()
      if (firstStudent) {
        await prisma.parent.create({
          data: {
            userId: parentUser.id,
            phone: "0241234567",
            occupation: "Engineer",
            children: {
              connect: { id: firstStudent.id }
            }
          }
        })
        console.log("✅ Parent created: parent@school.com / parent123")
        console.log("   Linked to first student")
      }
    }

    // Create sample homework
    const homeworkCount = await prisma.homework.count()
    if (homeworkCount === 0) {
      console.log("\nCreating sample homework...")
      const teacher = await prisma.teacher.findFirst()
      const classItem = await prisma.class.findFirst()

      if (teacher && classItem) {
        await prisma.homework.create({
          data: {
            title: "Math Assignment 1",
            description: "Complete exercises 1-10 from textbook",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            teacherId: teacher.id,
            classId: classItem.id,
            subject: "Mathematics"
          }
        })
        console.log("✅ Created sample homework")
      }
    }

    console.log("\n✨ Quick test data setup complete!")
    console.log("\n📝 Test Accounts:")
    console.log("   Admin:   admin@school.com / admin123")
    console.log("   Teacher: teacher@school.com / teacher123")
    console.log("   Student: student1@school.com / student123")
    console.log("   Parent:  parent@school.com / parent123")
    console.log("\n🎯 You can now test the system!")

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createQuickTestData()
