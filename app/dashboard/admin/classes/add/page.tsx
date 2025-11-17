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
import { CLASS_LEVELS, CLASS_CATEGORIES } from "@/lib/config/class-levels"

interface Teacher {
  id: string
  name: string
}

export default function AddClassPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState({
    name: "",
    form: "",
    customLevel: "",
    useCustomLevel: false,
    section: "",
    teacherId: "",
    room: "",
    capacity: "40",
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      const data = await response.json()
      if (data.success) {
        setTeachers(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Build the class name with section if provided
      const className = formData.section 
        ? `${formData.name} - Section ${formData.section}`
        : formData.name

      // Use custom level if provided, otherwise use selected level
      const classLevel = formData.useCustomLevel ? formData.customLevel : formData.form

      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: className,
          form: classLevel,
          level: classLevel, // Store the level for backward compatibility
          section: formData.section || "",
          room: formData.room,
          capacity: parseInt(formData.capacity),
          teacherId: formData.teacherId || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Class created successfully!")
        router.push("/dashboard/admin/classes")
      } else {
        toast.error(data.error || "Failed to create class")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error creating class:", error)
      toast.error("Failed to create class")
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
                href="/dashboard/admin/classes"
                className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4"
              >
                <ArrowLeft size={18} />
                Back to Classes
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Create New Class</h1>
              <p className="text-muted-foreground mt-1">Set up a new class for students</p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class Name Preview */}
                {(formData.name || formData.form || formData.customLevel) && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Class Name Preview:</p>
                    <p className="text-lg font-semibold text-primary">
                      {formData.name || "Class Name"}{formData.section ? ` - Section ${formData.section}` : ""}
                      {(formData.form || formData.customLevel) && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          ({formData.useCustomLevel ? formData.customLevel : CLASS_LEVELS.find(l => l.value === formData.form)?.label})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Class Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Morning Class, Blue Class"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Give your class a unique name
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-foreground">
                        Class Level *
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            useCustomLevel: !formData.useCustomLevel,
                            form: "",
                            customLevel: "",
                          })
                        }
                        className="text-xs text-primary hover:text-primary/80 underline"
                      >
                        {formData.useCustomLevel ? "Use Dropdown" : "Enter Custom Level"}
                      </button>
                    </div>

                    {formData.useCustomLevel ? (
                      <>
                        <Input
                          type="text"
                          name="customLevel"
                          value={formData.customLevel}
                          onChange={handleChange}
                          placeholder="e.g., Form 1, Year 7, Grade 10"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter your own custom class level name
                        </p>
                      </>
                    ) : (
                      <>
                        <select
                          name="form"
                          value={formData.form}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                          required
                        >
                          <option value="">Select class level</option>
                          
                          {CLASS_CATEGORIES.map((category) => (
                            <optgroup key={category.value} label={category.label}>
                              {CLASS_LEVELS.filter(level => level.category === category.value).map((level) => (
                                <option key={level.value} value={level.value}>
                                  {level.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Select from Ghanaian education system or{" "}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, useCustomLevel: true, form: "" })
                            }
                            className="text-primary hover:text-primary/80 underline"
                          >
                            enter custom level
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Class Level Info */}
                {(formData.form || formData.customLevel) && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Selected Level Information
                    </h3>
                    {(() => {
                      if (formData.useCustomLevel && formData.customLevel) {
                        return (
                          <div className="space-y-1">
                            <p className="text-sm text-foreground">
                              <span className="font-medium">Custom Level:</span> {formData.customLevel}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              You are using a custom class level name
                            </p>
                          </div>
                        )
                      }
                      
                      const selectedLevel = CLASS_LEVELS.find(l => l.value === formData.form)
                      if (!selectedLevel) return null
                      
                      const categoryInfo = CLASS_CATEGORIES.find(c => c.value === selectedLevel.category)
                      
                      return (
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Level:</span> {selectedLevel.label}
                          </p>
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Category:</span> {categoryInfo?.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Age Range:</span> {selectedLevel.ageRange}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Section (Optional)
                    </label>
                    <Input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="e.g., A, B, C"
                      maxLength={2}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For multiple sections of the same level
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Room Number *
                    </label>
                    <Input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="e.g., Room 101"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Capacity *
                    </label>
                    <Input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      placeholder="Max students"
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Class Teacher (Optional)
                  </label>
                  <select
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can assign a teacher later if needed
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Creating Class...
                      </>
                    ) : (
                      "Create Class"
                    )}
                  </Button>
                  <Link href="/dashboard/admin/classes">
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
