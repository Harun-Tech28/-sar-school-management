const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function findAdmin() {
  try {
    console.log('\n🔍 Looking for admin users...\n')

    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        fullName: true,
        accountStatus: true,
        createdAt: true
      }
    })

    if (admins.length === 0) {
      console.log('❌ No admin users found!')
      console.log('\n💡 Create an admin user with:')
      console.log('   npm run create-admin')
      console.log('   OR')
      console.log('   npx tsx scripts/quick-admin.ts')
    } else {
      console.log(`✅ Found ${admins.length} admin user(s):\n`)
      admins.forEach((admin, i) => {
        console.log(`${i + 1}. ${admin.fullName}`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   Status: ${admin.accountStatus}`)
        console.log(`   Created: ${admin.createdAt}`)
        console.log('')
      })
      
      console.log('💡 Use any of these emails to login as admin')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findAdmin()
