/**
 * Migration script to update class levels to Ghanaian education system
 * Run this script to migrate existing data from old class structure to new structure
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Mapping from old class levels to new class levels
const CLASS_MIGRATION_MAP = {
  // Old Early Childhood -> New Early Childhood
  'nursery-1': 'creche',
  'nursery-2': 'creche',
  'kg-1': 'kg',
  'kg-2': 'kg',
  
  // Old Primary -> New Basic School
  'primary-1': 'basic-1',
  'primary-2': 'basic-2',
  'primary-3': 'basic-3',
  'primary-4': 'basic-4',
  'primary-5': 'basic-5',
  'primary-6': 'basic-6',
  
  // Old JSS -> New JHS
  'jss-1': 'jhs-1',
  'jss-2': 'jhs-2',
  'jss-3': 'jhs-3',
  
  // Old SSS -> Remove (not part of this school system)
  'sss-1': null, // Will need manual handling
  'sss-2': null, // Will need manual handling
  'sss-3': null, // Will need manual handling
}

async function migrateClassLevels() {
  console.log('🚀 Starting class level migration...')
  
  try {
    // 1. Update Classes table (level field)
    console.log('🏫 Migrating class level records...')
    for (const [oldClass, newClass] of Object.entries(CLASS_MIGRATION_MAP)) {
      if (newClass) {
        const result = await prisma.class.updateMany({
          where: { level: oldClass },
          data: { level: newClass }
        })
        console.log(`   Updated ${result.count} class records from ${oldClass} to ${newClass}`)
      } else {
        // Handle SSS classes - log them for manual review
        const sssClasses = await prisma.class.findMany({
          where: { level: oldClass },
          select: { id: true, name: true, level: true }
        })
        if (sssClasses.length > 0) {
          console.log(`⚠️  Found ${sssClasses.length} classes with level ${oldClass} - requires manual handling:`)
          sssClasses.forEach(cls => {
            console.log(`     - ${cls.name} (ID: ${cls.id})`)
          })
        }
      }
    }

    // 2. Update Exam records (classes array field)
    console.log('📋 Migrating exam records...')
    const exams = await prisma.exam.findMany()
    let examUpdateCount = 0
    for (const exam of exams) {
      let updated = false
      const newClasses = exam.classes.map(classLevel => {
        if (CLASS_MIGRATION_MAP[classLevel] && CLASS_MIGRATION_MAP[classLevel] !== null) {
          updated = true
          return CLASS_MIGRATION_MAP[classLevel]
        }
        return classLevel
      })
      
      if (updated) {
        await prisma.exam.update({
          where: { id: exam.id },
          data: { classes: newClasses }
        })
        examUpdateCount++
      }
    }
    console.log(`   Updated ${examUpdateCount} exam records`)

    // 3. Update FeeStructure records (className field)
    console.log('💰 Migrating fee structure records...')
    for (const [oldClass, newClass] of Object.entries(CLASS_MIGRATION_MAP)) {
      if (newClass) {
        const result = await prisma.feeStructure.updateMany({
          where: { className: oldClass },
          data: { className: newClass }
        })
        console.log(`   Updated ${result.count} fee structure records from ${oldClass} to ${newClass}`)
      }
    }

    // 4. Generate summary report
    console.log('\n📊 Migration Summary:')
    console.log('='.repeat(50))
    
    const classLevels = await prisma.class.groupBy({
      by: ['level'],
      _count: {
        level: true
      }
    })
    
    console.log('Current class distribution by level:')
    classLevels.forEach(({ level, _count }) => {
      console.log(`   ${level}: ${_count.level} classes`)
    })
    
    // Count students per class level
    const classes = await prisma.class.findMany({
      include: {
        _count: {
          select: { students: true }
        }
      }
    })
    
    const studentsByLevel = {}
    classes.forEach(cls => {
      if (!studentsByLevel[cls.level]) {
        studentsByLevel[cls.level] = 0
      }
      studentsByLevel[cls.level] += cls._count.students
    })
    
    console.log('\nStudent distribution by class level:')
    Object.entries(studentsByLevel).forEach(([level, count]) => {
      console.log(`   ${level}: ${count} students`)
    })
    
    console.log('\n✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateClassLevels()
    .then(() => {
      console.log('🎉 Class level migration completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateClassLevels, CLASS_MIGRATION_MAP }
