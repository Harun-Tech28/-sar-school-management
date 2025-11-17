const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const GHANAIAN_CLASSES = [
  // Early Childhood
  { name: 'Creche', level: 'EARLY_CHILDHOOD', order: 1 },
  { name: 'Nursery 1', level: 'EARLY_CHILDHOOD', order: 2 },
  { name: 'Nursery 2', level: 'EARLY_CHILDHOOD', order: 3 },
  { name: 'KG 1', level: 'KINDERGARTEN', order: 4 },
  { name: 'KG 2', level: 'KINDERGARTEN', order: 5 },
  
  // Primary School (Basic)
  { name: 'Basic 1', level: 'PRIMARY', order: 6 },
  { name: 'Basic 2', level: 'PRIMARY', order: 7 },
  { name: 'Basic 3', level: 'PRIMARY', order: 8 },
  { name: 'Basic 4', level: 'PRIMARY', order: 9 },
  { name: 'Basic 5', level: 'PRIMARY', order: 10 },
  { name: 'Basic 6', level: 'PRIMARY', order: 11 },
  
  // Junior High School
  { name: 'JHS 1', level: 'JUNIOR_HIGH', order: 12 },
  { name: 'JHS 2', level: 'JUNIOR_HIGH', order: 13 },
  { name: 'JHS 3', level: 'JUNIOR_HIGH', order: 14 }
]

async function addAllGhanaianClasses() {
  console.log('🏫 Adding all Ghanaian class levels...')
  
  try {
    for (const classData of GHANAIAN_CLASSES) {
      // Check if class already exists
      const existingClass = await prisma.class.findFirst({
        where: { name: classData.name }
      })
      
      if (!existingClass) {
        const newClass = await prisma.class.create({
          data: {
            name: classData.name,
            form: classData.name, // Use class name as form
            capacity: 30, // Default capacity
            academicYear: '2024/2025',
            room: 'TBA'
          }
        })
        console.log(`✅ Created class: ${newClass.name}`)
      } else {
        console.log(`⏭️  Class already exists: ${classData.name}`)
      }
    }
    
    console.log('\n🎉 All Ghanaian classes have been added!')
    console.log('\n📋 Available classes:')
    
    const allClasses = await prisma.class.findMany({
      orderBy: { name: 'asc' }
    })
    
    allClasses.forEach(cls => {
      console.log(`   - ${cls.name}`)
    })
    
    console.log(`\n📊 Total classes: ${allClasses.length}`)
    
  } catch (error) {
    console.error('❌ Error adding classes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addAllGhanaianClasses()
