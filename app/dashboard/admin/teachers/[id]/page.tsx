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

interface TeacherData {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  classes: string
  joinDate: string
  status: string
}

export default function EditTeacherPage() {
  const router = useRouter()
  const params = useParams()
  const teacherId = params.id as string

  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<TeacherData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    subject: "",
    classes: "",
    joinDate: "",
    status: "Active",
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)

    // Load teacher data from API
    fetchTeacherData()
  }, [teacherId])

  const fetchTeacherData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/teachers/${teacherId}`)
      const data = await response.json()

      if (data.success) {
        const teacher = data.data
        setFormData({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone || "",
          subject: teacher.subject || "",
          classes: teacher.classes?.map((c: any) => c.name).join(", ") || "",
          joinDate: teacher.joinDate ? new Date(teacher.joinDate).toISOString().split('T')[0] : "",
          status: "Active",
        })
      } else {
        toast.error("Teacher not found")
        router.push("/dashboard/admin/teachers")
      }
    } catch (error) {
      console.error("Error fetching teacher:", error)
      toast.error("Failed to load teacher data")
      router.push("/dashboard/admin/teachers")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          joinDate: formData.joinDate,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Teacher updated successfully!")
        router.push("/dashboard/admin/teachers")
      } else {
        toast.error(data.error || "Failed to update teacher")
      }
    } catch (error) {
      console.error("Error updating teacher:", error)
      toast.error("Failed to update teacher")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof TeacherData, value: string) => {
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
                href="/dashboard/admin/teachers"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowLeft size={18} />
                Back to Teachers
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Edit Teacher</h1>
              <p className="text-muted-foreground mt-1">Update teacher information</p>
            </div>

            {/* Loading State */}
            {isLoading && !formData.id && (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <p className="text-muted-foreground">Loading teacher data...</p>
              </div>
            )}

            {/* Edit Form */}
            {formData.id && (
              <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g., Mr. Kwame Agyeman"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="teacher@sar.edu"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+233 24 123 4567"
                    required
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>

                {/* Classes */}
                <div className="space-y-2">
                  <Label htmlFor="classes">Classes Assigned</Label>
                  <Input
                    id="classes"
                    value={formData.classes}
                    onChange={(e) => handleChange("classes", e.target.value)}
                    placeholder="e.g., Form 1A, Form 2B"
                  />
                </div>

                {/* Join Date */}
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date *</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleChange("joinDate", e.target.value)}
                    required
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="gap-2">
                  <Save size={18} />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/dashboard/admin/teachers">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
