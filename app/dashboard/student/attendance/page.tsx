"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, Calendar } from "lucide-react"

export default function StudentAttendancePage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
  }, [])

  const attendanceRecords: Array<{ date: string; status: string; classes: number; reason?: string }> = []

  const totalDays = attendanceRecords.length
  const presentDays = attendanceRecords.filter(r => r.status === "present").length
  const absentDays = attendanceRecords.filter(r => r.status === "absent").length
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="student" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Student" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
              <p className="text-muted-foreground mt-1">Track your attendance record</p>
            </div>

            {attendanceRecords.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Attendance Rate</p>
                        <p className="text-4xl font-bold text-accent">{attendanceRate}%</p>
                      </div>
                      <CheckCircle className="text-accent" size={40} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {attendanceRate >= 90 ? "Excellent attendance!" : "Keep improving!"}
                    </p>
                  </Card>

                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Days Present</p>
                        <p className="text-4xl font-bold text-accent">{presentDays}</p>
                      </div>
                      <CheckCircle className="text-accent" size={40} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Out of {totalDays} days</p>
                  </Card>

                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Days Absent</p>
                        <p className="text-4xl font-bold text-destructive">{absentDays}</p>
                      </div>
                      <XCircle className="text-destructive" size={40} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Keep it low!</p>
                  </Card>
                </div>

                {/* Attendance Records */}
                <Card className="p-6 bg-card border-border">
                  <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Calendar size={24} />
                    Recent Attendance
                  </h2>
                  <div className="space-y-3">
                    {attendanceRecords.map((record, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          record.status === "present" ? "bg-accent/10" : "bg-destructive/10"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {record.status === "present" ? (
                            <CheckCircle className="text-accent" size={24} />
                          ) : (
                            <XCircle className="text-destructive" size={24} />
                          )}
                          <div>
                            <p className="font-semibold text-foreground">
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            {record.reason && (
                              <p className="text-sm text-muted-foreground">Reason: {record.reason}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            record.status === "present" ? "text-accent" : "text-destructive"
                          }`}>
                            {record.status === "present" ? "Present" : "Absent"}
                          </p>
                          {record.status === "present" && (
                            <p className="text-sm text-muted-foreground">{record.classes} classes attended</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Monthly Overview */}
                <Card className="p-6 bg-card border-border mt-6">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Monthly Overview</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => {
                      const dayNum = i + 1
                      const hasRecord = attendanceRecords.some(r => 
                        new Date(r.date).getDate() === dayNum
                      )
                      const record = attendanceRecords.find(r => 
                        new Date(r.date).getDate() === dayNum
                      )
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                            !hasRecord ? "bg-muted/30 text-muted-foreground" :
                            record?.status === "present" ? "bg-accent/20 text-accent" :
                            "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {dayNum}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-accent/20"></div>
                      <span className="text-muted-foreground">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-destructive/20"></div>
                      <span className="text-muted-foreground">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-muted/30"></div>
                      <span className="text-muted-foreground">No Record</span>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 bg-card border-border text-center">
                <CheckCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Attendance Records</h3>
                <p className="text-muted-foreground">Your attendance records will appear here once your teachers start taking attendance.</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
