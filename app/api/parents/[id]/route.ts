import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/parents/[id] - Get parent details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("[API] Fetching parent with ID:", id)
    
    // Connect to database
    await prisma.$connect()
    
    const parent = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        parent: {
          include: {
            children: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                  },
                },
                class: {
                  select: {
                    id: true,
                    name: true,
                    form: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    console.log("[API] Parent found:", parent ? "Yes" : "No", "Role:", parent?.role)

    if (!parent || parent.role !== "PARENT") {
      console.log("[API] Returning 404 - Parent not found or wrong role")
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      )
    }

    console.log("[API] Returning parent data successfully")
    return NextResponse.json(parent)
  } catch (error) {
    console.error("[API] Error fetching parent:", error)
    console.error("[API] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Failed to fetch parent details", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/parents/[id] - Update parent
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.$connect()
    
    const body = await request.json()
    const { fullName, email, phone, address, occupation } = body

    // Check if parent exists
    const existingParent = await prisma.user.findUnique({
      where: { id: id },
      include: { parent: true },
    })

    if (!existingParent || existingParent.role !== "PARENT") {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      )
    }

    // Check if email is being changed and if it's already in use
    if (email !== existingParent.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        )
      }
    }

    // Update user data
    await prisma.user.update({
      where: { id: id },
      data: {
        fullName,
        email,
        phone,
      },
    })

    // Update or create parent data
    if (existingParent.parent) {
      await prisma.parent.update({
        where: { id: existingParent.parent.id },
        data: {
          phone: phone || existingParent.parent.phone,
          address: address || existingParent.parent.address,
          occupation,
        },
      })
    } else {
      // Create parent record if it doesn't exist
      await prisma.parent.create({
        data: {
          userId: id,
          phone: phone || "",
          address: address || "",
          occupation,
        },
      })
    }

    // Fetch updated parent with relations
    const updatedParent = await prisma.user.findUnique({
      where: { id: id },
      include: {
        parent: true,
      },
    })

    return NextResponse.json({ success: true, data: updatedParent })
  } catch (error) {
    console.error("Error updating parent:", error)
    return NextResponse.json(
      { error: "Failed to update parent", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/parents/[id] - Delete parent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.$connect()
    
    // Check if parent exists
    const parent = await prisma.user.findUnique({
      where: { id: id },
      include: {
        parent: {
          include: {
            children: true,
          },
        },
      },
    })

    if (!parent || parent.role !== "PARENT") {
      return NextResponse.json(
        { error: "Parent not found" },
        { status: 404 }
      )
    }

    // Check if parent has linked children
    if (parent.parent?.children && parent.parent.children.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete parent with linked children. Please unlink children first." },
        { status: 400 }
      )
    }

    // Delete parent record first (if exists)
    if (parent.parent) {
      await prisma.parent.delete({
        where: { id: parent.parent.id },
      })
    }

    // Delete user
    await prisma.user.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true, message: "Parent deleted successfully" })
  } catch (error) {
    console.error("Error deleting parent:", error)
    return NextResponse.json(
      { error: "Failed to delete parent", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
