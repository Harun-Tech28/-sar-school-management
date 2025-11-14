"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Search, Users, Check } from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  userId: string
  admissionNumber: string
  parentId: string | null
  user: {
    fullName: string
    email: string
  }
  class: {
    name: string
    level: string
  }
}

interface Parent {
  id: string
  fullName: string
  parent: {
    id: string
  } | null
}

export default function LinkChildrenPage() {
  const params = useParams()
  const router = useRouter()
  const [parent, setParent] = useState<Parent | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Fetch parent details
      const parentRes = await fetch(`/api/parents/${params.id}`)
      if (!parentRes.ok) {
        const errorData = await parentRes.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch parent")
      }
      const parentData = await parentRes.json()
      setParent(parentData)

      // Fetch all students (with high limit to get all)
      const studentsRes = await fetch("/api/students?limit=1000")
      if (!studentsRes.ok) {
        const errorData = await studentsRes.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch students")
      }
      const studentsResponse = await studentsRes.json()
      
      // Handle the response format: { success, data, pagination }
      const studentsData = studentsResponse.data || studentsResponse
      
      // Ensure studentsData is an array
      if (Array.isArray(studentsData)) {
        setStudents(studentsData)
      } else {
        console.error("Students data is not an array:", studentsData)
        setStudents([])
        throw new Error("Invalid students data received")
      }

      // Pre-select already linked children
      if (parentData.parent?.children) {
        const linkedIds = parentData.parent.children.map((c: any) => c.id)
        setSelectedStudents(linkedIds)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
      setStudents([]) // Ensure students is always an array
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSave = async () => {
    if (!parent?.parent?.id) {
      setError("Parent record not found. Please edit parent details first.")
      return
    }

    setSaving(true)
    setError("")

    try {
      const response = await fetch(`/api/parents/${params.id}/link-children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: parent.parent.id,
          studentIds: selectedStudents,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to link children")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/admin/parents/${params.id}`)
      }, 1500)
    } catch (error) {
      console.error("Error linking children:", error)
      setError(error instanceof Error ? error.message : "Failed to link children")
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = Array.isArray(students) ? students.filter(student =>
    student.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/admin/parents/${params.id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Link Children</h1>
          <p className="text-gray-600 mt-1">
            Select students to link to {parent?.fullName}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Children linked successfully! Redirecting...</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name, admission number, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Select Students ({selectedStudents.length} selected)
          </h2>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No students found matching your search" : "No students available"}
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => handleToggleStudent(student.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStudents.includes(student.id)
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedStudents.includes(student.id)
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}>
                      {selectedStudents.includes(student.id) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{student.user.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        {student.admissionNumber} • {student.class ? student.class.name : 'No class assigned'}
                      </p>
                      {student.parentId && (
                        <p className="text-xs text-orange-600 mt-1">
                          Already linked to another parent
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving || selectedStudents.length === 0}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Users size={20} />
          {saving ? "Saving..." : `Link ${selectedStudents.length} Student(s)`}
        </button>
        <Link
          href={`/dashboard/admin/parents/${params.id}`}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}
