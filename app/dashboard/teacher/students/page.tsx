"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, Mail, Hash, Calendar } from "lucide-react"
import { toast } from "react-hot-toast"

interface Student {
  id: string
  name: string
  email: string
  rollNumber: string
  class: string
  classId: string
  form: string
  gender: string
  dateOfBirth: string
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/auth/login"
      return
    }
    
    fetchTeacherId(user.id)
  }, [])

  const fetchTeacherId = async (userId: string) => {
    try {
      const response = await fetch(`/api/teachers?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.teachers && data.teachers.length > 0) {
          fetchStudents(data.teachers[0].id)
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
    }
  }

  const fetchStudents = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/teachers/me/students?teacherId=${teacherId}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.data || [])
      } else {
        toast.error("Failed to load students")
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Failed to load students")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === "all" || student.classId === selectedClass
    return matchesSearch && matchesClass
  })

  const uniqueClasses = Array.from(new Set(students.map(s => s.classId)))
    .map(classId => students.find(s => s.classId === classId))
    .filter(Boolean)

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="text-[#E31E24]" size={32} />
          My Students
        </h1>
        <p className="text-gray-600 mt-2">
          View all students in your classes
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Students</label>
            <input
              type="text"
              placeholder="Search by name or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {uniqueClasses.map((student) => (
                <option key={student?.classId} value={student?.classId}>
                  {student?.class}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Students Found
          </h3>
          <p className="text-gray-500">
            {searchQuery || selectedClass !== "all"
              ? "No students match your search criteria."
              : "You don't have any students assigned to your classes yet."}
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[#E31E24]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-[#E31E24]" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.class}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Hash size={16} className="text-gray-500" />
                    <span>{student.rollNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={16} className="text-gray-500" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar size={16} className="text-gray-500" />
                    <span>{student.gender}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Showing:</strong> {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </>
      )}
    </div>
  )
}
