"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, User, Mail, Phone, BookOpen, Calendar, Users, Loader2, CheckCircle2 } from "lucide-react"
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

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <Link
                href="/dashboard/admin/teachers"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E31E24] mb-4 sm:mb-6 transition-colors group"
              >
                <div className="p-1.5 sm:p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="font-medium text-sm sm:text-base">Back to Teachers</span>
              </Link>
              
              <div className="bg-gradient-to-r from-[#E31E24] to-[#FFD100] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <User size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#E31E24]" />
                  </div>
                  <div className="text-white min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">Edit Teacher Profile</h1>
                    <p className="text-white/90 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base">Update teacher information and details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && !formData.id && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-8 sm:p-12 md:p-16 text-center shadow-lg">
                <Loader2 className="animate-spin text-[#E31E24] mx-auto mb-3 sm:mb-4" size={40} />
                <p className="text-gray-600 text-base sm:text-lg font-medium">Loading teacher data...</p>
              </div>
            )}

            {/* Edit Form */}
            {formData.id && (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Personal Information Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#E31E24] to-[#FFD100] rounded-lg flex items-center justify-center flex-shrink-0">
                      <User size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    {/* Full Name */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <User size={14} className="sm:w-4 sm:h-4 text-[#E31E24]" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g., Mr. Kwame Agyeman"
                        className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-[#E31E24] focus:ring-[#E31E24]"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <Mail size={14} className="sm:w-4 sm:h-4 text-[#E31E24]" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="teacher@sar.edu"
                        className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-[#E31E24] focus:ring-[#E31E24]"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <Phone size={14} className="sm:w-4 sm:h-4 text-[#E31E24]" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+233 24 123 4567"
                        className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-[#E31E24] focus:ring-[#E31E24]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Professional Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <BookOpen size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="e.g., Mathematics"
                        className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Classes */}
                    <div className="space-y-2">
                      <Label htmlFor="classes" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <Users size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                        Classes Assigned
                      </Label>
                      <Input
                        id="classes"
                        value={formData.classes}
                        onChange={(e) => handleChange("classes", e.target.value)}
                        placeholder="e.g., Form 1A, Form 2B"
                        className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled
                      />
                      <p className="text-xs text-gray-500">Classes are managed separately</p>
                    </div>

                    {/* Join Date */}
                    <div className="space-y-2">
                      <Label htmlFor="joinDate" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                        Join Date *
                      </Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => handleChange("joinDate", e.target.value)}
                        className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-gray-700 font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <CheckCircle2 size={14} className="sm:w-4 sm:h-4 text-green-600" />
                        Status *
                      </Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full h-11 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 bg-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-all"
                        required
                      >
                        <option value="Active">✓ Active</option>
                        <option value="On Leave">⏸ On Leave</option>
                        <option value="Inactive">✗ Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="text-red-500">*</span> Required fields
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <Link href="/dashboard/admin/teachers" className="flex-1 sm:flex-none">
                        <Button type="button" variant="outline" className="h-10 sm:h-11 md:h-12 px-4 sm:px-5 md:px-6 border-2 text-sm sm:text-base w-full sm:w-auto">
                          Cancel
                        </Button>
                      </Link>
                      <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="flex-1 sm:flex-none h-10 sm:h-11 md:h-12 px-5 sm:px-6 md:px-8 bg-gradient-to-r from-[#E31E24] to-[#FFD100] hover:from-[#c91920] hover:to-[#e6c200] text-white font-semibold shadow-lg hover:shadow-xl transition-all gap-1.5 sm:gap-2 text-sm sm:text-base"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                            <span className="hidden xs:inline">Saving...</span>
                            <span className="xs:hidden">Save</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden xs:inline">Save Changes</span>
                            <span className="xs:hidden">Save</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
