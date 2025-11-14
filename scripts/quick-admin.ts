import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function createQuickAdmin() {
  console.log('\n🎓 SAR Educational Complex - Quick Admin Setup\n')

  try {
    // Default admin credentials
    const adminData = {
      fullName: 'SAR Administrator',
      email: 'admin@sar.edu',
      password: 'Admin@123',
      department: 'Administration',
      phone: '+233 24 000 0000'
    }

    console.log('⏳ Creating admin account...')
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Password: ${adminData.password}`)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    })

    if (existingUser) {
      console.log('\n⚠️  Admin account already exists!')
      console.log(`   Email: ${adminData.email}`)
      console.log(`   Password: ${adminData.password}`)
      console.log('\n🔐 You can login at: http://localhost:3000/auth/login')
      return
    }

    // Hash password
    const hashedPassword = await hash(adminData.password, 10)

    // Create user and admin in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          fullName: adminData.fullName,
          phone: adminData.phone,
          role: 'ADMIN'
        }
      })

      const admin = await tx.admin.create({
        data: {
          userId: user.id,
          department: adminData.department
        }
      })

      return { user, admin }
    })

    console.log('\n✅ Admin account created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Password: ${adminData.password}`)
    console.log(`   Role: Administrator`)
    console.log('\n🔐 Login at: http://localhost:3000/auth/login')
    console.log('\n⚠️  IMPORTANT: Change this password after first login!')

  } catch (error) {
    console.error('\n❌ Error creating admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createQuickAdmin()
