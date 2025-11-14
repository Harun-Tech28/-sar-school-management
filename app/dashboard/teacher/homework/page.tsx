"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Users, CheckCircle, Clock } from "lucide-react"

interface Assignment {
  id: string
  title: string
  class: string
  subject: string
  dueDate: string
  totalStudents: number
  submitted: number
  pending: number
}

export default function TeacherHomeworkPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [assignments] = useState<Assignment[]>([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
  }, [])

  const totalAssignments = assignments.length
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submitted, 0)
  const totalPending = assignments.reduce((sum, a) => sum + a.pending, 0)

  const getCompletionRate = (submitted: number, total: number) => {
    return Math.round((submitted / total) * 100)
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="teacher" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Teacher" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Homework Management</h1>
                <p className="text-muted-foreground mt-1">Create homework assignments and track student submissions</p>
              </div>
              <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
                <Plus size={18} />
                Create Assignment
              </Button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <Card className="p-6 bg-card border-border mb-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Create New Assignment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assignment Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Chapter 5 Exercises"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Mathematics</option>
                      <option>English</option>
                      <option>Science</option>
                      <option>History</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Class</label>
                    <select className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Form 1A</option>
                      <option>Form 2B</option>
                      <option>Form 3C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Assignment instructions..."
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Attach Files (Optional)
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          if (files.length > 0) {
                            alert(`${files.length} file(s) selected: ${files.map(f => f.name).join(', ')}\n\nNote: File upload requires cloud storage setup. See HOMEWORK_FILE_UPLOAD_GUIDE.md for implementation details.`)
                          }
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FileText className="w-12 h-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-foreground font-medium">
                          Click to upload files
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, DOCX, JPG, PNG, GIF (max 10MB each)
                        </p>
                        <p className="text-xs text-destructive mt-2">
                          ⚠️ File storage not configured yet
                        </p>
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      📄 To enable file uploads, follow the setup guide in <code className="bg-muted px-1 py-0.5 rounded">HOMEWORK_FILE_UPLOAD_GUIDE.md</code>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => {
                    alert("Homework creation feature is under development.\n\nTo implement:\n1. Add Homework model to database\n2. Create homework API endpoints\n3. Connect form to backend\n\nThis is currently a UI mockup.")
                  }}>
                    Create Assignment
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                </div>
              </Card>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Assignments</p>
                    <p className="text-3xl font-bold text-foreground">{totalAssignments}</p>
                  </div>
                  <FileText className="text-primary" size={32} />
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Submissions</p>
                    <p className="text-3xl font-bold text-accent">{totalSubmissions}</p>
                  </div>
                  <CheckCircle className="text-accent" size={32} />
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pending</p>
                    <p className="text-3xl font-bold text-chart-3">{totalPending}</p>
                  </div>
                  <Clock className="text-chart-3" size={32} />
                </div>
              </Card>
            </div>

            {/* Assignments Overview */}
            {assignments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Assignment Progress</h2>
                  <div className="space-y-4">
                    {assignments.map((assignment) => {
                    const completionRate = getCompletionRate(assignment.submitted, assignment.totalStudents)
                    return (
                      <div key={assignment.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{assignment.title}</p>
                            <p className="text-xs text-muted-foreground">{assignment.subject} • {assignment.class}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Submissions</span>
                            <span className="font-medium">{assignment.submitted}/{assignment.totalStudents}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className={`rounded-full h-2.5 transition-all ${
                                completionRate >= 90 ? "bg-accent" : 
                                completionRate >= 70 ? "bg-chart-3" : 
                                "bg-destructive"
                              }`}
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-semibold ${
                              completionRate >= 90 ? "text-accent" : 
                              completionRate >= 70 ? "text-chart-3" : 
                              "text-destructive"
                            }`}>
                              {completionRate}% Complete
                            </span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">View Details</Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Class Summary</h2>
                <div className="space-y-4">
                  {["Form 1A", "Form 2B", "Form 3C"].map((className) => {
                    const classAssignments = assignments.filter(a => a.class === className)
                    const totalStudents = classAssignments[0]?.totalStudents || 0
                    const totalSubmitted = classAssignments.reduce((sum, a) => sum + a.submitted, 0)
                    const totalPossible = classAssignments.reduce((sum, a) => sum + a.totalStudents, 0)
                    const classRate = totalPossible > 0 ? Math.round((totalSubmitted / totalPossible) * 100) : 0
                    
                    return (
                      <div key={className} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-foreground">{className}</p>
                            <p className="text-xs text-muted-foreground">{totalStudents} students</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">{classAssignments.length}</p>
                            <p className="text-xs text-muted-foreground">assignments</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Overall Completion</span>
                            <span className="font-medium">{classRate}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`rounded-full h-2 ${
                                classRate >= 85 ? "bg-accent" : 
                                classRate >= 70 ? "bg-chart-3" : 
                                "bg-destructive"
                              }`}
                              style={{ width: `${classRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  <div className="mt-6 p-4 rounded-lg bg-primary/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Pending Reviews</p>
                        <p className="text-3xl font-bold text-primary">{totalSubmissions}</p>
                      </div>
                      <Button className="gap-2">
                        <FileText size={16} />
                        Review All
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 text-lg mb-2">No homework assignments yet</p>
                <p className="text-gray-500 text-sm mb-6">Create your first assignment to get started</p>
                <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                  <Plus size={18} />
                  Create Assignment
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
