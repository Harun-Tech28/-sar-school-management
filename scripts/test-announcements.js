const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAnnouncements() {
  try {
    const announcements = await prisma.announcement.findMany({
      take: 5,
      include: {
        author: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Total announcements:', announcements.length)
    console.log('\nAnnouncements:')
    announcements.forEach(ann => {
      console.log(`- ${ann.title} (${ann.priority}) - ${ann.targetAudience}`)
      console.log(`  By: ${ann.author?.fullName || 'Unknown'}`)
      console.log(`  Date: ${ann.date}`)
      console.log('')
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAnnouncements()
