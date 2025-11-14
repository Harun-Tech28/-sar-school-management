import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function createAdmin() {
  console.log('\n🎓 SAR Educational Complex - Admin Account Setup\n')
  console.log('This script will create your first administrator account.\n')

  try {
    // Get admin details
    const fullName = await question('Admin Full Name: ')
    const email = await question('Admin Email: ')
    const password = await question('Admin Password (min 8 characters): ')
    const confirmPassword = await question('Confirm Password: ')
    const department = await question('Department (e.g., Administration): ')
    const phone = await question('Phone Number (optional): ')

    // Validate inputs
    if (!fullName || !email || !password) {
      console.error('\n❌ Error: All fields except phone are required')
      process.exit(1)
    }

    if (password !== confirmPassword) {
      console.error('\n❌ Error: Passwords do not match')
      process.exit(1)
    }

    if (password.length < 8) {
      console.error('\n❌ Error: Password must be at least 8 characters')
      process.exit(1)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.error('\n❌ Error: Email already exists')
      process.exit(1)
    }

    console.log('\n⏳ Creating admin account...')

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user and admin in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          phone: phone || null,
          role: 'ADMIN'
        }
      })

      const admin = await tx.admin.create({
        data: {
          userId: user.id,
          department: department || 'Administration'
        }
      })

      return { user, admin }
    })

    console.log('\n✅ Admin account created successfully!')
    console.log('\n📋 Account Details:')
    console.log(`   Name: ${result.user.fullName}`)
    console.log(`   Email: ${result.user.email}`)
    console.log(`   Role: Administrator`)
    console.log(`   Department: ${result.admin.department}`)
    console.log('\n🔐 You can now login at: http://localhost:3000/auth/login')
    console.log('\n⚠️  IMPORTANT: Store these credentials securely!')

  } catch (error) {
    console.error('\n❌ Error creating admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

createAdmin()
