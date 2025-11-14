"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit2, Plus, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ExportButton } from "@/components/ui/export-button"
import { exportStudentList, exportToCSV } from "@/lib/export-utils"

interface Student {
  id: string
  rollNumber: string
  user: {
    id: string
    email: string
    fullName: string
  }
  class: {
    id: string
    name: string
    form: string
  } | null
  dateOfBirth: string
  gender: string
  address: string
  phone: string | null
}

export default function StudentsPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/students?limit=100")
      const data = await response.json()
      
      if (data.success) {
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
    const searchLower = searchQuery.toLowerCase().trim()
    if (!searchLower) return true
    
    return (
      (student.user?.fullName || '').toLowerCase().includes(searchLower) ||
      (student.user?.email || '').toLowerCase().includes(searchLower) ||
      (student.rollNumber || '').toLowerCase().includes(searchLower) ||
      (student.class?.name || '').toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        toast.success("Student deleted successfully")
        fetchStudents()
      } else {
        toast.error(data.error || "Failed to delete student")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error("Failed to delete student")
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
                <p className="text-muted-foreground mt-1">Manage all students in the school</p>
              </div>
              <div className="flex gap-3">
                {students.length > 0 && (
                  <ExportButton
                    data={students}
                    filename="Students_List"
                    onExportExcel={() => {
                      const data = students.map((s, i) => ({
                        '#': i + 1,
                        'Student ID': s.rollNumber,
                        'Full Name': s.user.fullName,
                        'Class': s.class?.name || 'No class',
                        'Gender': s.gender,
                        'Email': s.user.email,
                        'Phone': s.phone || 'N/A',
                        'Address': s.address,
                      }))
                      exportStudentList(data)
                    }}
                    onExportCSV={() => {
                      const data = students.map((s, i) => ({
                        '#': i + 1,
                        'Roll Number': s.rollNumber,
                        'Name': s.user.fullName,
                        'Class': s.class?.name || 'No class',
                        'Gender': s.gender,
                        'Email': s.user.email,
                        'Phone': s.phone || 'N/A',
                      }))
                      exportToCSV(data, 'Students_List')
                    }}
                    onPrint={() => window.print()}
                  />
                )}
                <Link href="/dashboard/admin/students/add">
                  <Button className="gap-2">
                    <Plus size={18} />
                    Add Student
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center gap-2">
                <Search size={20} className="text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, roll number, or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Students Table */}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.user.fullName}</TableCell>
                        <TableCell>{student.user.email}</TableCell>
                        <TableCell>{student.class?.name || "No class"}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>{student.phone || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/dashboard/admin/students/${student.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Edit2 size={16} />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(student.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isLoading && filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No students found</p>
                <Link href="/dashboard/admin/students/add">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Add Your First Student
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
