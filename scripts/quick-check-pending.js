const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Get the most recent user
  const recentUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  })

  console.log('\n=== MOST RECENT USER ===')
  if (recentUser) {
    console.log('Email:', recentUser.email)
    console.log('Name:', recentUser.fullName)
    console.log('Role:', recentUser.role)
    console.log('Status:', recentUser.accountStatus)
    console.log('Created:', recentUser.createdAt)
  } else {
    console.log('No users found')
  }

  // Count pending users
  const pendingCount = await prisma.user.count({
    where: { accountStatus: 'PENDING' }
  })

  console.log('\n=== PENDING USERS COUNT ===')
  console.log('Total pending:', pendingCount)

  // List all pending users
  if (pendingCount > 0) {
    const pending = await prisma.user.findMany({
      where: { accountStatus: 'PENDING' },
      select: {
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    })
    console.log('\n=== PENDING USERS LIST ===')
    pending.forEach((u, i) => {
      console.log(`${i + 1}. ${u.email} - ${u.role} - ${u.fullName}`)
    })
  }

  await prisma.$disconnect()
}

main().catch(console.error)
