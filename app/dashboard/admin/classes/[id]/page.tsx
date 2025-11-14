"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ClassData {
  id: string
  name: string
  form: string
  teacher: string
  studentCount: number
  room: string
  capacity: number
}

export default function EditClassPage() {
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string

  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ClassData>({
    id: "",
    name: "",
    form: "",
    teacher: "",
    studentCount: 0,
    room: "",
    capacity: 40,
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)

    // Load class data (in a real app, this would fetch from API)
    // For now, using demo data
    const demoClasses: ClassData[] = [
      {
        id: "1",
        name: "Form 1A",
        form: "Form 1",
        teacher: "Mr. Agyeman",
        studentCount: 38,
        room: "101",
        capacity: 40,
      },
      {
        id: "2",
        name: "Form 1B",
        form: "Form 1",
        teacher: "Miss Akosua",
        studentCount: 35,
        room: "102",
        capacity: 40,
      },
      {
        id: "3",
        name: "Form 2A",
        form: "Form 2",
        teacher: "Mr. Boateng",
        studentCount: 36,
        room: "201",
        capacity: 40,
      },
      {
        id: "4",
        name: "Form 3C",
        form: "Form 3",
        teacher: "Mrs. Mensah",
        studentCount: 32,
        room: "301",
        capacity: 40,
      },
    ]

    const classData = demoClasses.find((c) => c.id === classId)
    if (classData) {
      setFormData(classData)
    } else {
      toast.error("Class not found")
      router.push("/dashboard/admin/classes")
    }
  }, [classId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call an API endpoint
      // await fetch(`/api/classes/${classId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(formData)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Class updated successfully!")
      router.push("/dashboard/admin/classes")
    } catch (error) {
      console.error("Error updating class:", error)
      toast.error("Failed to update class")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof ClassData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Link
                href="/dashboard/admin/classes"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft size={18} />
                Back to Classes
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Edit Class</h1>
              <p className="text-muted-foreground mt-1">Update class information</p>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., Form 1A"
                    required
                  />
                </div>

                {/* Form Level */}
                <div className="space-y-2">
                  <Label htmlFor="form">Form Level *</Label>
                  <Input
                    id="form"
                    value={formData.form}
                    onChange={(e) => handleChange("form", e.target.value)}
                    placeholder="e.g., Form 1"
                    required
                  />
                </div>

                {/* Teacher */}
                <div className="space-y-2">
                  <Label htmlFor="teacher">Class Teacher *</Label>
                  <Input
                    id="teacher"
                    value={formData.teacher}
                    onChange={(e) => handleChange("teacher", e.target.value)}
                    placeholder="e.g., Mr. Agyeman"
                    required
                  />
                </div>

                {/* Room */}
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number *</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => handleChange("room", e.target.value)}
                    placeholder="e.g., 101"
                    required
                  />
                </div>

                {/* Student Count */}
                <div className="space-y-2">
                  <Label htmlFor="studentCount">Current Students</Label>
                  <Input
                    id="studentCount"
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => handleChange("studentCount", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">Room Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
                    placeholder="40"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Capacity Warning */}
              {formData.studentCount > formData.capacity && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Warning: Student count ({formData.studentCount}) exceeds room capacity ({formData.capacity})
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="gap-2">
                  <Save size={18} />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/dashboard/admin/classes">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
