import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTeacherClasses() {
  try {
    // Get all teachers
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        primaryClasses: {
          select: {
            id: true,
            name: true,
          },
        },
        classes: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    console.log(`\nFound ${teachers.length} teachers:\n`)

    for (const teacher of teachers) {
      console.log(`Teacher: ${teacher.user.fullName} (${teacher.user.email})`)
      console.log(`  ID: ${teacher.id}`)
      console.log(`  Primary Classes: ${teacher.primaryClasses.length}`)
      teacher.primaryClasses.forEach(cls => {
        console.log(`    - ${cls.name} (${cls.id})`)
      })
      console.log(`  Teaching Classes: ${teacher.classes.length}`)
      teacher.classes.forEach(ct => {
        console.log(`    - ${ct.class.name} (${ct.class.id})`)
      })
      console.log()
    }

    // Also check all classes
    const allClasses = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        teacherId: true,
        _count: {
          select: {
            teachers: true,
            students: true,
          },
        },
      },
    })

    console.log(`\nAll Classes (${allClasses.length}):\n`)
    allClasses.forEach(cls => {
      console.log(`${cls.name} (${cls.id})`)
      console.log(`  Primary Teacher ID: ${cls.teacherId || 'None'}`)
      console.log(`  Teachers: ${cls._count.teachers}`)
      console.log(`  Students: ${cls._count.students}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTeacherClasses()
