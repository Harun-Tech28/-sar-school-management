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

    // Fetch class data from API
    const fetchClassData = async () => {
      try {
        console.log('[Edit Class] Fetching class with ID:', classId)
        const response = await fetch(`/api/classes/${classId}`)
        console.log('[Edit Class] Response status:', response.status)
        
        const result = await response.json()
        console.log('[Edit Class] Response data:', result)

        if (result.success && result.data) {
          setFormData({
            id: result.data.id,
            name: result.data.name,
            form: result.data.form,
            teacher: result.data.teacher,
            studentCount: result.data.studentCount,
            room: result.data.room,
            capacity: result.data.capacity,
          })
          console.log('[Edit Class] Class data loaded successfully')
        } else {
          console.error('[Edit Class] Class not found:', result.error)
          toast.error(result.error || "Class not found")
          setTimeout(() => router.push("/dashboard/admin/classes"), 2000)
        }
      } catch (error) {
        console.error("[Edit Class] Error fetching class:", error)
        toast.error("Failed to load class data. Check console for details.")
        setTimeout(() => router.push("/dashboard/admin/classes"), 2000)
      }
    }

    fetchClassData()
  }, [classId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          form: formData.form,
          room: formData.room,
          capacity: formData.capacity,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Class updated successfully!")
        router.push("/dashboard/admin/classes")
      } else {
        toast.error(result.error || "Failed to update class")
      }
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
