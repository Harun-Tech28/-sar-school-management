"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { ExportButton } from "@/components/ui/export-button"
import { exportClassList, exportToCSV } from "@/lib/export-utils"

interface Class {
  id: string
  name: string
  form: string
  teacher: string
  teacherId: string | null
  studentCount: number
  room: string
  capacity: number
}

export default function ClassesPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      setIsLoading(true)
      const response = await fetch("/api/classes")
      const data = await response.json()
      
      if (data.success) {
        setClasses(data.data || [])
      } else {
        toast.error("Failed to load classes")
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast.error("Failed to load classes")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.form.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) {
      return
    }

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        toast.success("Class deleted successfully")
        fetchClasses()
      } else {
        toast.error(data.error || "Failed to delete class")
      }
    } catch (error) {
      console.error("Error deleting class:", error)
      toast.error("Failed to delete class")
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
                <h1 className="text-3xl font-bold text-foreground">Class Management</h1>
                <p className="text-muted-foreground mt-1">Manage all classes and their timetables</p>
              </div>
              <div className="flex gap-3">
                {classes.length > 0 && (
                  <ExportButton
                    data={classes}
                    filename="Classes_List"
                    onExportExcel={() => {
                      const data = classes.map((c, i) => ({
                        '#': i + 1,
                        'Class Name': c.name,
                        'Form': c.form,
                        'Room': c.room,
                        'Capacity': c.capacity,
                        'Current Students': c.studentCount,
                        'Teacher': c.teacher,
                      }))
                      exportClassList(data)
                    }}
                    onExportCSV={() => {
                      const data = classes.map((c, i) => ({
                        '#': i + 1,
                        'Class': c.name,
                        'Form': c.form,
                        'Room': c.room,
                        'Students': `${c.studentCount}/${c.capacity}`,
                        'Teacher': c.teacher,
                      }))
                      exportToCSV(data, 'Classes_List')
                    }}
                    onPrint={() => window.print()}
                  />
                )}
                <Link href="/dashboard/admin/classes/add">
                  <Button className="gap-2">
                    <Plus size={18} />
                    Add Class
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <Input
                placeholder="Search by class name, form, or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Classes Table */}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Form</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell>{cls.form}</TableCell>
                        <TableCell>{cls.teacher}</TableCell>
                        <TableCell>
                          {cls.studentCount}/{cls.capacity}
                        </TableCell>
                        <TableCell>{cls.room}</TableCell>
                        <TableCell>{cls.capacity}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/dashboard/admin/classes/${cls.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Edit2 size={16} />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(cls.id)}
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

            {!isLoading && filteredClasses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No classes found</p>
                <Link href="/dashboard/admin/classes/add">
                  <Button>
                    <Plus size={18} className="mr-2" />
                    Create Your First Class
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
