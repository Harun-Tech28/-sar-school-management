"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Users, BookOpen, MapPin, TrendingUp } from "lucide-react"
import { toast } from "react-hot-toast"

interface Class {
  id: string
  name: string
  form: string
  room: string
  capacity: number
  studentCount: number
  teacher: string
  teacherId: string | null
}

export default function TeacherClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [teacherId, setTeacherId] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/auth/login"
      return
    }
    
    // Get teacher ID from user
    const userId = user.id
    fetchTeacherId(userId)
  }, [])

  const fetchTeacherId = async (userId: string) => {
    try {
      const response = await fetch(`/api/teachers?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.teachers && data.teachers.length > 0) {
          const tId = data.teachers[0].id
          setTeacherId(tId)
          fetchClasses(tId)
        } else {
          toast.error("Teacher profile not found")
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error("Error fetching teacher ID:", error)
      setIsLoading(false)
    }
  }

  const fetchClasses = async (tId: string) => {
    try {
      const response = await fetch(`/api/teachers/me/classes?teacherId=${tId}`)
      if (response.ok) {
        const data = await response.json()
        setClasses(data.data || [])
      } else {
        toast.error("Failed to load your classes")
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast.error("Failed to load your classes")
    } finally {
      setIsLoading(false)
    }
  }

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
          <BookOpen className="text-[#E31E24]" size={32} />
          My Classes
        </h1>
        <p className="text-gray-600 mt-2">
          View all classes in the school
        </p>
      </div>

      {classes.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Classes Found
          </h3>
          <p className="text-gray-500">
            There are no classes available at the moment.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#E31E24]"
              onClick={() => router.push(`/dashboard/teacher/attendance`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {cls.name}
                  </h3>
                  <p className="text-sm text-gray-600">{cls.form}</p>
                </div>
                <div className="w-12 h-12 bg-[#E31E24]/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-[#E31E24]" size={24} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={18} className="text-gray-500" />
                  <span className="text-sm">
                    {cls.studentCount} / {cls.capacity} Students
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} className="text-gray-500" />
                  <span className="text-sm">Room {cls.room}</span>
                </div>

                {cls.teacher && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={18} className="text-gray-500" />
                    <span className="text-sm">Teacher: {cls.teacher}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Capacity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E31E24] rounded-full"
                        style={{
                          width: `${Math.min((cls.studentCount / cls.capacity) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {Math.round((cls.studentCount / cls.capacity) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Total Classes:</strong> {classes.length} | <strong>Total Students:</strong>{" "}
          {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
        </p>
      </div>
    </div>
  )
}
