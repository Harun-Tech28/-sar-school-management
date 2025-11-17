const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyApproval() {
  const email = 'camor@gmail.com'
  
  try {
    console.log('\n🔍 Checking approval status for:', email)
    console.log('─'.repeat(50))

    // Check user status
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log('\n👤 User Information:')
    console.log('   Name:', user.fullName)
    console.log('   Email:', user.email)
    console.log('   Role:', user.role)
    console.log('   Status:', user.accountStatus)
    console.log('   Created:', user.createdAt)
    console.log('   Updated:', user.updatedAt)

    // Check if approved
    if (user.accountStatus === 'ACTIVE') {
      console.log('\n✅ USER IS APPROVED!')
      
      // Check if role record exists
      if (user.role === 'PARENT') {
        const parent = await prisma.parent.findUnique({
          where: { userId: user.id }
        })
        
        if (parent) {
          console.log('✅ Parent record created')
          console.log('   Parent ID:', parent.id)
        } else {
          console.log('⚠️  Parent record NOT found (should be created on approval)')
        }
      } else if (user.role === 'STUDENT') {
        const student = await prisma.student.findUnique({
          where: { userId: user.id }
        })
        
        if (student) {
          console.log('✅ Student record created')
        } else {
          console.log('⚠️  Student record NOT found')
        }
      } else if (user.role === 'TEACHER') {
        const teacher = await prisma.teacher.findUnique({
          where: { userId: user.id }
        })
        
        if (teacher) {
          console.log('✅ Teacher record created')
        } else {
          console.log('⚠️  Teacher record NOT found')
        }
      }

      console.log('\n🎉 User can now login!')
      
    } else if (user.accountStatus === 'PENDING') {
      console.log('\n⏳ USER IS STILL PENDING')
      console.log('   Waiting for admin approval')
      console.log('   User cannot login yet')
      
    } else if (user.accountStatus === 'REJECTED') {
      console.log('\n❌ USER WAS REJECTED')
      console.log('   User cannot login')
    }

    console.log('\n' + '─'.repeat(50))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyApproval()
