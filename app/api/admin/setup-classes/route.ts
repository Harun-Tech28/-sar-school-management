import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const GHANAIAN_CLASSES = [
  // Early Childhood
  { name: 'Creche', level: 'EARLY_CHILDHOOD', order: 1 },
  { name: 'Nursery 1', level: 'EARLY_CHILDHOOD', order: 2 },
  { name: 'Nursery 2', level: 'EARLY_CHILDHOOD', order: 3 },
  { name: 'KG 1', level: 'KINDERGARTEN', order: 4 },
  { name: 'KG 2', level: 'KINDERGARTEN', order: 5 },

  // Primary School (Basic)
  { name: 'Basic 1', level: 'PRIMARY', order: 6 },
  { name: 'Basic 2', level: 'PRIMARY', order: 7 },
  { name: 'Basic 3', level: 'PRIMARY', order: 8 },
  { name: 'Basic 4', level: 'PRIMARY', order: 9 },
  { name: 'Basic 5', level: 'PRIMARY', order: 10 },
  { name: 'Basic 6', level: 'PRIMARY', order: 11 },

  // Junior High School
  { name: 'JHS 1', level: 'JUNIOR_HIGH', order: 12 },
  { name: 'JHS 2', level: 'JUNIOR_HIGH', order: 13 },
  { name: 'JHS 3', level: 'JUNIOR_HIGH', order: 14 },
]

export async function POST(request: NextRequest) {
  try {
    // Security: Only allow this in development or with a secret key
    const authHeader = request.headers.get('authorization')
    const setupKey = process.env.SETUP_SECRET_KEY

    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${setupKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      created: [] as string[],
      existing: [] as string[],
      errors: [] as string[],
    }

    for (const classData of GHANAIAN_CLASSES) {
      try {
        // Check if class already exists
        const existingClass = await prisma.class.findFirst({
          where: { name: classData.name },
        })

        if (!existingClass) {
          const newClass = await prisma.class.create({
            data: {
              name: classData.name,
              form: classData.name,
              capacity: 30,
              academicYear: '2024/2025',
              room: 'TBA',
            },
          })
          results.created.push(newClass.name)
        } else {
          results.existing.push(classData.name)
        }
      } catch (error) {
        results.errors.push(`${classData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Get all classes
    const allClasses = await prisma.class.findMany({
      orderBy: { name: 'asc' },
      select: { name: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Ghanaian classes setup completed',
      results,
      totalClasses: allClasses.length,
      allClasses: allClasses.map((c) => c.name),
    })
  } catch (error) {
    console.error('Error setting up classes:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to setup classes',
      },
      { status: 500 }
    )
  }
}
