"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Class {
  id: string
  name: string
  form: string
}

export default function AddStudentPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    classId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    admissionType: "NEW",
    previousSchool: "",
    previousClass: "",
    transferCertificate: false,
    medicalRecords: false,
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      const data = await response.json()
      if (data.success) {
        setClasses(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Student added successfully!")
        router.push("/dashboard/admin/students")
      } else {
        toast.error(data.error || "Failed to add student")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error adding student:", error)
      toast.error("Failed to add student")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Link
                href="/dashboard/admin/students"
                className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
              >
                <ArrowLeft size={18} />
                Back to Students
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Add New Student</h1>
              <p className="text-muted-foreground mt-1">Create a new student record</p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Admission Type Selection */}
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Admission Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                      formData.admissionType === 'NEW' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}>
                      <input
                        type="radio"
                        name="admissionType"
                        value="NEW"
                        checked={formData.admissionType === 'NEW'}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-semibold text-foreground">New Admission</div>
                        <div className="text-xs text-muted-foreground">First time joining school</div>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                      formData.admissionType === 'CONTINUING' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}>
                      <input
                        type="radio"
                        name="admissionType"
                        value="CONTINUING"
                        checked={formData.admissionType === 'CONTINUING'}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-semibold text-foreground">Continuing Student</div>
                        <div className="text-xs text-muted-foreground">Returning student</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter student's full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Roll Number *
                    </label>
                    <Input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g., STU001"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@school.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Class *
                    </label>
                    <select
                      name="classId"
                      value={formData.classId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.form}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date of Birth *
                    </label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter home address"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
                    required
                  />
                </div>

                {/* Additional Fields for New Admissions */}
                {formData.admissionType === 'NEW' && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-blue-600">📋</span>
                      New Admission Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Previous School
                        </label>
                        <Input
                          type="text"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleChange}
                          placeholder="Name of previous school"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Previous Class/Form
                        </label>
                        <Input
                          type="text"
                          name="previousClass"
                          value={formData.previousClass}
                          onChange={handleChange}
                          placeholder="e.g., Form 2"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="transferCertificate"
                          checked={formData.transferCertificate}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm text-foreground">
                          Transfer Certificate (TC) Received
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="medicalRecords"
                          checked={formData.medicalRecords}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm text-foreground">
                          Medical Records Submitted
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Adding Student...
                      </>
                    ) : (
                      "Add Student"
                    )}
                  </Button>
                  <Link href="/dashboard/admin/students">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
