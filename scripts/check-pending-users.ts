import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPendingUsers() {
  try {
    console.log('🔍 Checking database for pending users...\n')

    // Get all users with their status
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    console.log(`📊 Total users found: ${allUsers.length}`)
    console.log('\n📋 Recent users:')
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`)
      console.log(`   Name: ${user.fullName}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Status: ${user.accountStatus}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log('')
    })

    // Count by status
    const statusCounts = await prisma.user.groupBy({
      by: ['accountStatus'],
      _count: true
    })

    console.log('📈 Users by status:')
    statusCounts.forEach(status => {
      console.log(`   ${status.accountStatus}: ${status._count}`)
    })

    // Get pending users specifically
    const pendingUsers = await prisma.user.findMany({
      where: {
        accountStatus: 'PENDING'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    })

    console.log(`\n✅ Pending users: ${pendingUsers.length}`)
    if (pendingUsers.length > 0) {
      pendingUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.role})`)
      })
    } else {
      console.log('⚠️  No pending users found!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPendingUsers()
