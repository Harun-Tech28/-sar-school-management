/**
 * Migration script to add admission type fields to existing students
 * Run this after updating the Prisma schema
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting admission types migration...\n')

  try {
    // Count existing students
    const totalStudents = await prisma.student.count()
    console.log(`📊 Found ${totalStudents} existing students\n`)

    if (totalStudents === 0) {
      console.log('✅ No existing students to migrate')
      return
    }

    // Update all existing students to CONTINUING type
    const result = await prisma.student.updateMany({
      where: {
        admissionType: null, // Only update students without admission type
      },
      data: {
        admissionType: 'CONTINUING',
        status: 'ACTIVE',
        transferCertificate: false,
        medicalRecords: false,
      },
    })

    console.log(`✅ Updated ${result.count} students to CONTINUING type`)
    console.log(`✅ Set all students to ACTIVE status`)
    console.log('\n🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
