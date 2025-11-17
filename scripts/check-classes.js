const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkClasses() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log('📚 Classes in database:')
    classes.forEach(c => {
      console.log(`   - ${c.name}`)
    })
    console.log(`\n📊 Total: ${classes.length} classes`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkClasses()
