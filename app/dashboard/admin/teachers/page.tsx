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
import { exportTeacherList, exportToExcel, exportToCSV } from "@/lib/export-utils"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  classes: string
  classCount: number
  joinDate: string
  status: string
}

export default function TeachersPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      setIsLoading(true)
      const response = await fetch("/api/teachers")
      const data = await response.json()
      
      if (data.success) {
        setTeachers(data.data || [])
      } else {
        toast.error("Failed to load teachers")
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load teachers")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchQuery.toLowerCase().trim()
    if (!searchLower) return true
    
    return (
      (teacher.name || '').toLowerCase().includes(searchLower) ||
      (teacher.email || '').toLowerCase().includes(searchLower) ||
      (teacher.subject || '').toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) {
      return
    }

    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        toast.success("Teacher deleted successfully")
        fetchTeachers()
      } else {
        toast.error(data.error || "Failed to delete teacher")
      }
    } catch (error) {
      console.error("Error deleting teacher:", error)
      toast.error("Failed to delete teacher")
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
                <h1 className="text-3xl font-bold text-foreground">Teacher Management</h1>
                <p className="text-muted-foreground mt-1">Manage all teachers and their assignments</p>
              </div>
              <div className="flex gap-3">
                {teachers.length > 0 && (
                  <ExportButton
                    data={teachers}
                    filename="Teachers_List"
                    onExportExcel={() => exportTeacherList(teachers)}
                    onExportCSV={() => {
                      const data = teachers.map((t, i) => ({
                        '#': i + 1,
                        'Name': t.name,
                        'Email': t.email,
                        'Phone': t.phone,
                        'Subject': t.subject,
                        'Classes': t.classes,
                        'Join Date': t.joinDate || 'N/A',
                      }))
                      exportToCSV(data, 'Teachers_List')
                    }}
                    onPrint={() => window.print()}
                  />
                )}
                <Link href="/dashboard/admin/teachers/add">
                  <Button className="gap-2">
                    <Plus size={18} />
                    Add Teacher
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center gap-2">
                <Search size={20} className="text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
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

            {/* Teachers Table */}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.classes || "No classes"}</TableCell>
                        <TableCell>{teacher.phone}</TableCell>
                        <TableCell>{teacher.joinDate ? new Date(teacher.joinDate).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                            {teacher.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/dashboard/admin/teachers/${teacher.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Edit2 size={16} />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(teacher.id)}
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

            {!isLoading && filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No teachers found</p>
                <Link href="/dashboard/admin/teachers/add">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Add Your First Teacher
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
