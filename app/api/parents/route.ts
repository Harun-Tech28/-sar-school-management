import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const parents = await prisma.user.findMany({
      where: {
        role: "PARENT"
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        createdAt: true,
        parent: {
          select: {
            id: true,
            address: true,
            occupation: true,
            children: {
              select: {
                id: true,
                user: {
                  select: {
                    fullName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(parents)
  } catch (error) {
    console.error("Error fetching parents:", error)
    return NextResponse.json(
      { error: "Failed to fetch parents" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, phone, address, password, occupation } = body

    // Validate required fields
    if (!email || !firstName || !lastName || !phone || !address || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if parent already exists
    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Parent with this email already exists" },
        { status: 400 }
      )
    }

    // Create new parent with User and Parent records
    const fullName = `${firstName} ${lastName}`
    const parent = await prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        password, // In production, hash this password
        role: "PARENT",
        parent: {
          create: {
            phone,
            address,
            occupation: occupation || undefined
          }
        }
      },
      include: {
        parent: true
      }
    })

    return NextResponse.json(parent, { status: 201 })
  } catch (error) {
    console.error("Error creating parent:", error)
    return NextResponse.json(
      { error: "Failed to create parent" },
      { status: 500 }
    )
  }
}
