"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Search, X, Users } from "lucide-react"
import Link from "next/link"

interface Parent {
  id: string
  userId: string
  user: {
    fullName: string
    email: string
  }
  phone: string
}

interface FormData {
  name: string
  email: string
  form: string
  rollNumber: string
  admissionDate: string
  dateOfBirth: string
  parentName: string
  parentPhone: string
  parentId: string | null
}

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showParentModal, setShowParentModal] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "Ama Boateng",
    email: "ama.boateng@school.com",
    form: "Form 2A",
    rollNumber: "001",
    admissionDate: "2023-09-15",
    dateOfBirth: "2009-05-20",
    parentName: "Kwame Boateng",
    parentPhone: "0244567890",
    parentId: null,
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    
    // Fetch parents list
    fetchParents()
  }, [])

  const fetchParents = async () => {
    try {
      const response = await fetch("/api/parents?limit=1000")
      if (response.ok) {
        const data = await response.json()
        setParents(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching parents:", error)
    }
  }

  const handleSelectParent = (parent: Parent) => {
    setSelectedParent(parent)
    setFormData({
      ...formData,
      parentId: parent.id,
      parentName: parent.user.fullName,
      parentPhone: parent.phone || "",
    })
    setShowParentModal(false)
    setSearchTerm("")
  }

  const handleClearParent = () => {
    setSelectedParent(null)
    setFormData({
      ...formData,
      parentId: null,
      parentName: "",
      parentPhone: "",
    })
  }

  const filteredParents = parents.filter(parent => {
    const search = searchTerm.toLowerCase()
    return (
      parent.user.fullName.toLowerCase().includes(search) ||
      parent.user.email.toLowerCase().includes(search) ||
      (parent.phone || "").toLowerCase().includes(search)
    )
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Student updated:", formData)
      router.push("/dashboard/admin/students")
      setIsLoading(false)
    }, 500)
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
              <h1 className="text-3xl font-bold text-foreground">Edit Student</h1>
              <p className="text-muted-foreground mt-1">Update student information</p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Form/Class</label>
                      <select
                        name="form"
                        value={formData.form}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                        required
                      >
                        <option value="Form 1A">Form 1A</option>
                        <option value="Form 1B">Form 1B</option>
                        <option value="Form 2A">Form 2A</option>
                        <option value="Form 2B">Form 2B</option>
                        <option value="Form 3C">Form 3C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Roll Number</label>
                      <Input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Admission Date</label>
                      <Input
                        type="date"
                        name="admissionDate"
                        value={formData.admissionDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Parent/Guardian Information</h3>
                  
                  {selectedParent || formData.parentId ? (
                    <div className="border border-border rounded-lg p-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{formData.parentName}</p>
                          <p className="text-sm text-muted-foreground">{formData.parentPhone}</p>
                          {selectedParent && (
                            <p className="text-xs text-muted-foreground mt-1">{selectedParent.user.email}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowParentModal(true)}
                          >
                            Change
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearParent}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowParentModal(true)}
                      className="w-full gap-2"
                    >
                      <Users size={18} />
                      Select Parent/Guardian
                    </Button>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Link href="/dashboard/admin/students">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Parent Selection Modal */}
      {showParentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Select Parent/Guardian</h2>
                <button
                  onClick={() => {
                    setShowParentModal(false)
                    setSearchTerm("")
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            {/* Parents List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredParents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No parents found matching your search" : "No parents available"}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredParents.map((parent) => (
                    <button
                      key={parent.id}
                      onClick={() => handleSelectParent(parent)}
                      className="w-full text-left border border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{parent.user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{parent.user.email}</p>
                          {parent.phone && (
                            <p className="text-sm text-muted-foreground mt-1">📞 {parent.phone}</p>
                          )}
                        </div>
                        <Users size={20} className="text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowParentModal(false)
                  setSearchTerm("")
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
