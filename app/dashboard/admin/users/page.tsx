"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Search, Loader2, Shield, User, Users, GraduationCap, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  fullName: string
  role: string
  createdAt: string
  lastLogin?: string
  profileId?: string // For navigating to specific profile pages
}

export default function UsersManagementPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      // Fetch from multiple endpoints
      const [studentsRes, teachersRes, parentsRes] = await Promise.all([
        fetch("/api/students?limit=1000"),
        fetch("/api/teachers"),
        fetch("/api/parents"),
      ])

      const studentsData = await studentsRes.json()
      const teachersData = await teachersRes.json()
      const parentsData = await parentsRes.json()

      const allUsers: User[] = []

      // Add students
      if (studentsData.success && studentsData.data) {
        studentsData.data.forEach((student: any) => {
          allUsers.push({
            id: student.user.id,
            email: student.user.email,
            fullName: student.user.fullName,
            role: "student",
            createdAt: student.user.createdAt || new Date().toISOString(),
            profileId: student.id, // Store student ID for navigation
          })
        })
      }

      // Add teachers
      if (teachersData.success && teachersData.data) {
        teachersData.data.forEach((teacher: any) => {
          allUsers.push({
            id: teacher.id,
            email: teacher.email,
            fullName: teacher.name,
            role: "teacher",
            createdAt: teacher.joinDate || new Date().toISOString(),
            profileId: teacher.id, // Store teacher ID for navigation
          })
        })
      }

      // Add parents
      if (Array.isArray(parentsData)) {
        parentsData.forEach((parent: any) => {
          allUsers.push({
            id: parent.id,
            email: parent.email,
            fullName: parent.fullName,
            role: "parent",
            createdAt: parent.createdAt || new Date().toISOString(),
            profileId: parent.id, // Store parent ID for navigation
          })
        })
      }

      setUsers(allUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase().trim()
    
    const matchesSearch = !searchLower || (
      (user.fullName || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.role || '').toLowerCase().includes(searchLower)
    )

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleDelete = async (user: User) => {
    if (user.id === userId) {
      toast.error("You cannot delete your own account")
      return
    }

    if (!confirm(`Are you sure you want to delete ${user.fullName}'s account? This action cannot be undone.`)) {
      return
    }

    try {
      let endpoint = ""
      switch (user.role) {
        case "student":
          // Find student ID from students list
          const studentsRes = await fetch("/api/students?limit=1000")
          const studentsData = await studentsRes.json()
          const student = studentsData.data?.find((s: any) => s.user.id === user.id)
          if (student) {
            endpoint = `/api/students/${student.id}`
          }
          break
        case "teacher":
          endpoint = `/api/teachers/${user.id}`
          break
        case "parent":
          endpoint = `/api/parents/${user.id}`
          break
        default:
          toast.error("Cannot delete this user type")
          return
      }

      if (!endpoint) {
        toast.error("User not found")
        return
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success || response.ok) {
        toast.success(`${user.fullName}'s account deleted successfully`)
        fetchUsers()
      } else {
        toast.error(data.error || "Failed to delete user account")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user account")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield size={16} className="text-primary" />
      case "teacher":
        return <User size={16} className="text-blue-600" />
      case "parent":
        return <Users size={16} className="text-purple-600" />
      case "student":
        return <GraduationCap size={16} className="text-green-600" />
      default:
        return <User size={16} className="text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary/10 text-primary"
      case "teacher":
        return "bg-blue-100 text-blue-700"
      case "parent":
        return "bg-purple-100 text-purple-700"
      case "student":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleUserClick = (user: User) => {
    if (!user.profileId) {
      toast.error("Profile not available")
      return
    }

    // Navigate to the appropriate profile page based on role
    switch (user.role) {
      case "student":
        router.push(`/dashboard/admin/students/${user.profileId}`)
        break
      case "teacher":
        router.push(`/dashboard/admin/teachers/${user.profileId}`)
        break
      case "parent":
        router.push(`/dashboard/admin/parents/${user.profileId}`)
        break
      case "admin":
        toast.info("Admin profiles are managed in Settings")
        break
      default:
        toast.error("Unknown user type")
    }
  }

  const roleStats = {
    all: users.length,
    student: users.filter((u) => u.role === "student").length,
    teacher: users.filter((u) => u.role === "teacher").length,
    parent: users.filter((u) => u.role === "parent").length,
    admin: users.filter((u) => u.role === "admin").length,
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="admin" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Admin" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage all user accounts across the system</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <button
                onClick={() => setRoleFilter("all")}
                className={`p-4 rounded-lg border transition-all ${
                  roleFilter === "all"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{roleStats.all}</p>
              </button>

              <button
                onClick={() => setRoleFilter("student")}
                className={`p-4 rounded-lg border transition-all ${
                  roleFilter === "student"
                    ? "border-green-600 bg-green-50"
                    : "border-border bg-card hover:border-green-600/50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold text-green-600">{roleStats.student}</p>
              </button>

              <button
                onClick={() => setRoleFilter("teacher")}
                className={`p-4 rounded-lg border transition-all ${
                  roleFilter === "teacher"
                    ? "border-blue-600 bg-blue-50"
                    : "border-border bg-card hover:border-blue-600/50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Teachers</p>
                <p className="text-2xl font-bold text-blue-600">{roleStats.teacher}</p>
              </button>

              <button
                onClick={() => setRoleFilter("parent")}
                className={`p-4 rounded-lg border transition-all ${
                  roleFilter === "parent"
                    ? "border-purple-600 bg-purple-50"
                    : "border-border bg-card hover:border-purple-600/50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Parents</p>
                <p className="text-2xl font-bold text-purple-600">{roleStats.parent}</p>
              </button>

              <button
                onClick={() => setRoleFilter("admin")}
                className={`p-4 rounded-lg border transition-all ${
                  roleFilter === "admin"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-primary">{roleStats.admin}</p>
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center gap-2">
                <Search size={20} className="text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or role..."
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

            {/* Users Table */}
            {!isLoading && (
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="group">
                          <TableCell className="font-medium">
                            <button
                              onClick={() => handleUserClick(user)}
                              className="flex items-center gap-2 text-left hover:text-primary transition-colors group-hover:underline"
                            >
                              <span>{user.fullName}</span>
                              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </button>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleUserClick(user)}
                              className="text-left hover:text-primary transition-colors"
                            >
                              {user.email}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                                  user.role
                                )}`}
                              >
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={user.id === userId}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
