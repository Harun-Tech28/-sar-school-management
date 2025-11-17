"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SUBJECTS_BY_LEVEL } from "@/lib/config/ghana-education"

interface Class {
  id: string
  name: string
  level?: string
  form?: string
}

// Get all unique subjects from all levels
const getAllSubjects = () => {
  const allSubjects = new Set<string>()
  Object.values(SUBJECTS_BY_LEVEL).forEach(subjects => {
    subjects.forEach(subject => allSubjects.add(subject))
  })
  return Array.from(allSubjects).sort()
}

const DEFAULT_SUBJECTS = getAllSubjects()

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
  const [customSubject, setCustomSubject] = useState("")
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false)
  const [customClass, setCustomClass] = useState("")
  const [showCustomClassInput, setShowCustomClassInput] = useState(false)
  const [customClasses, setCustomClasses] = useState<string[]>([])

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

    if (formData.classes.length === 0 && customClasses.length === 0) {
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
      // Combine selected class IDs and custom class names
      const allClasses = [...formData.classes, ...customClasses]

      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          classes: allClasses,
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

  const addCustomSubject = () => {
    if (customSubject.trim() && !formData.subjects.includes(customSubject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, customSubject.trim()],
      }))
      setCustomSubject("")
      setShowCustomSubjectInput(false)
    }
  }

  const removeSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }))
  }

  const selectAllClasses = () => {
    setFormData((prev) => ({
      ...prev,
      classes: classes.map((c) => c.id),
    }))
  }

  const deselectAllClasses = () => {
    setFormData((prev) => ({
      ...prev,
      classes: [],
    }))
  }

  const selectAllSubjects = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: DEFAULT_SUBJECTS,
    }))
  }

  const deselectAllSubjects = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [],
    }))
  }

  const addCustomClass = () => {
    if (customClass.trim() && !customClasses.includes(customClass.trim())) {
      setCustomClasses((prev) => [...prev, customClass.trim()])
      setCustomClass("")
      setShowCustomClassInput(false)
    }
  }

  const removeCustomClass = (className: string) => {
    setCustomClasses((prev) => prev.filter((c) => c !== className))
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Subjects *
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllSubjects}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deselectAllSubjects}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Selected Subjects Pills */}
                {formData.subjects.length > 0 && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">
                      Selected ({formData.subjects.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Subjects Checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {DEFAULT_SUBJECTS.map((subject) => (
                    <label
                      key={subject}
                      className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-foreground">{subject}</span>
                    </label>
                  ))}
                </div>

                {/* Add Custom Subject */}
                {!showCustomSubjectInput ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomSubjectInput(true)}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Custom Subject
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSubject())}
                      placeholder="Enter subject name"
                      className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addCustomSubject}
                      disabled={!customSubject.trim()}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCustomSubjectInput(false)
                        setCustomSubject("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {errors.subjects && (
                  <p className="text-red-500 text-sm mt-2">{errors.subjects}</p>
                )}
              </Card>

              <Card className="p-6 bg-card border-border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Classes *
                  </h2>
                  {classes.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllClasses}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={deselectAllClasses}
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

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
                  <>
                    {/* Selected Classes Pills */}
                    {formData.classes.length > 0 && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">
                          Selected ({formData.classes.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.classes.map((classId) => {
                            const cls = classes.find((c) => c.id === classId)
                            return cls ? (
                              <span
                                key={classId}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {cls.name}
                                <button
                                  type="button"
                                  onClick={() => toggleClass(classId)}
                                  className="hover:bg-primary/20 rounded-full p-0.5"
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}

                    {/* Custom Classes Pills */}
                    {customClasses.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-muted-foreground mb-2">
                          Custom Classes ({customClasses.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {customClasses.map((className) => (
                            <span
                              key={className}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                            >
                              {className}
                              <button
                                type="button"
                                onClick={() => removeCustomClass(className)}
                                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Classes Checkboxes */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {classes.map((cls) => (
                        <label
                          key={cls.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition"
                        >
                          <input
                            type="checkbox"
                            checked={formData.classes.includes(cls.id)}
                            onChange={() => toggleClass(cls.id)}
                            className="w-4 h-4 text-primary"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground font-medium">
                              {cls.name}
                            </span>
                            {cls.form && (
                              <span className="text-xs text-muted-foreground">
                                {cls.form}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Add Custom Class */}
                    {!showCustomClassInput ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomClassInput(true)}
                        className="w-full"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Custom Class Name
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customClass}
                          onChange={(e) => setCustomClass(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomClass())}
                          placeholder="Enter class name (e.g., Form 4A, Year 10)"
                          className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={addCustomClass}
                          disabled={!customClass.trim()}
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCustomClassInput(false)
                            setCustomClass("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </>
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
