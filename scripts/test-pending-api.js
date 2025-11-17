// Quick test to simulate what the frontend does
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAPI() {
  try {
    console.log('\n🧪 Testing Pending Users API Logic...\n')

    // This is what the API does
    const pendingUsers = await prisma.$queryRaw`
      SELECT id, email, "fullName", "firstName", "lastName", phone, role, "createdAt", "accountStatus"
      FROM "User"
      WHERE "accountStatus" = 'PENDING'
      ORDER BY "createdAt" DESC
    `

    console.log('✅ Query executed successfully')
    console.log(`📊 Found ${pendingUsers.length} pending user(s)\n`)

    if (pendingUsers.length > 0) {
      console.log('📋 Pending Users:')
      pendingUsers.forEach((user, i) => {
        console.log(`\n${i + 1}. ${user.fullName}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Status: ${user.accountStatus}`)
        console.log(`   Created: ${user.createdAt}`)
      })
    }

    // Also check with Prisma's normal method
    console.log('\n\n🔍 Double-checking with Prisma findMany...')
    const pendingUsers2 = await prisma.user.findMany({
      where: { accountStatus: 'PENDING' },
      select: {
        id: true,
        email: true,
        fullName: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        accountStatus: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`✅ Found ${pendingUsers2.length} pending user(s) with findMany\n`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPI()
