const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function test() {
  try {
    console.log('\n🔍 Testing Database Access...\n')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    console.log('')

    // Test 1: Direct Prisma query (what scripts use)
    console.log('=== TEST 1: Direct Prisma findMany ===')
    const directResult = await prisma.user.findMany({
      where: { accountStatus: 'PENDING' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true
      }
    })
    console.log('Result:', directResult.length, 'users')
    if (directResult.length > 0) {
      console.log('Users:', directResult.map(u => u.email))
    }
    console.log('')

    // Test 2: Raw SQL query (what API uses)
    console.log('=== TEST 2: Raw SQL Query ===')
    const rawResult = await prisma.$queryRaw`
      SELECT id, email, "fullName", "firstName", "lastName", phone, role, "createdAt", "accountStatus"
      FROM "User"
      WHERE "accountStatus" = 'PENDING'
      ORDER BY "createdAt" DESC
    `
    console.log('Result:', rawResult.length, 'users')
    if (rawResult.length > 0) {
      console.log('Users:', rawResult.map(u => u.email))
    }
    console.log('')

    // Test 3: Check AccountStatus enum values
    console.log('=== TEST 3: All Account Statuses ===')
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        accountStatus: true
      },
      take: 10
    })
    console.log('Sample users:')
    allUsers.forEach(u => {
      console.log(`  ${u.email}: ${u.accountStatus}`)
    })
    console.log('')

    // Test 4: Check if camor@gmail.com exists
    console.log('=== TEST 4: Check Specific User ===')
    const camorUser = await prisma.user.findUnique({
      where: { email: 'camor@gmail.com' },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true,
        createdAt: true
      }
    })
    if (camorUser) {
      console.log('✅ User found:')
      console.log('   Email:', camorUser.email)
      console.log('   Name:', camorUser.fullName)
      console.log('   Status:', camorUser.accountStatus)
      console.log('   Role:', camorUser.role)
    } else {
      console.log('❌ User NOT found!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
