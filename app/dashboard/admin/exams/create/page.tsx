"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Class {
  id: string
  name: string
}

const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "Social Studies",
  "ICT",
  "French",
  "Religious & Moral Education",
  "Creative Arts",
  "Physical Education",
  "Ghanaian Language",
]

export default function CreateExamPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    examType: "End of Term",
    term: "Term 1",
    academicYear: "2025",
    startDate: "",
    endDate: "",
    subjects: [] as string[],
    classes: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        setClasses(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Exam name must be at least 3 characters"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = "At least one subject is required"
    }

    if (formData.classes.length === 0) {
      newErrors.classes = "At least one class is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdBy: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/dashboard/admin/exams")
      } else {
        alert(data.error || "Failed to create exam")
      }
    } catch (error) {
      console.error("Failed to create exam:", error)
      alert("Failed to create exam")
    } finally {
      setLoading(false)
    }
  }

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const toggleClass = (classId: string) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(classId)
        ? prev.classes.filter((c) => c !== classId)
        : [...prev.classes, classId],
    }))
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <Link
                href="/dashboard/admin/exams"
                className="text-primary hover:text-primary/80 text-sm mb-2 inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Exams
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Create New Exam</h1>
              <p className="text-muted-foreground mt-1">
                Set up a new exam for your students
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Card className="p-6 bg-card border-border mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Exam Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Exam Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., End of Term 1 Examination"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Exam Type *
                      </label>
                      <select
                        value={formData.examType}
                        onChange={(e) =>
                          setFormData({ ...formData, examType: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="Mid-Term">Mid-Term</option>
                        <option value="End of Term">End of Term</option>
                        <option value="Mock">Mock Exam</option>
                        <option value="Final">Final Exam</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Term *
                      </label>
                      <select
                        value={formData.term}
                        onChange={(e) =>
                          setFormData({ ...formData, term: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Academic Year *
                      </label>
                      <select
                        value={formData.academicYear}
                        onChange={(e) =>
                          setFormData({ ...formData, academicYear: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      />
                      {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Subjects *
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SUBJECTS.map((subject) => (
                    <label
                      key={subject}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{subject}</span>
                    </label>
                  ))}
                </div>
                {errors.subjects && (
                  <p className="text-red-500 text-sm mt-2">{errors.subjects}</p>
                )}
              </Card>

              <Card className="p-6 bg-card border-border mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Classes *
                </h2>
                {classes.length === 0 ? (
                  <div className="text-center py-8 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      No classes available. You need to create classes first.
                    </p>
                    <Link href="/dashboard/admin/classes/add">
                      <Button type="button" variant="outline">
                        Create Classes
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {classes.map((cls) => (
                      <label
                        key={cls.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.classes.includes(cls.id)}
                          onChange={() => toggleClass(cls.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground">{cls.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.classes && (
                  <p className="text-red-500 text-sm mt-2">{errors.classes}</p>
                )}
              </Card>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={loading || classes.length === 0} 
                  className="flex-1"
                >
                  {loading ? "Creating..." : classes.length === 0 ? "No Classes Available" : "Create Exam"}
                </Button>
                <Link href="/dashboard/admin/exams" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
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
