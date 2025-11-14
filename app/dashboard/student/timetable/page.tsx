"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

export default function StudentTimetablePage() {
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

  const timetable: Record<string, Array<{ time: string; subject: string; teacher: string; room: string }>> = {}

  const days = Object.keys(timetable)
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const hasTimetable = days.length > 0

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="student" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Student" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
              <p className="text-muted-foreground mt-1">View your weekly class schedule</p>
            </div>

            {hasTimetable ? (
              <>
                {/* Current Day Highlight */}
                <Card className="p-4 bg-primary/10 border-primary mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-primary" size={24} />
                    <p className="text-lg font-semibold text-foreground">
                      Today is {currentDay}
                    </p>
                  </div>
                </Card>

                {/* Weekly Timetable */}
                <div className="space-y-6">
                  {days.map((day) => (
                    <Card key={day} className={`p-6 bg-card border-border ${
                      day === currentDay ? "ring-2 ring-primary" : ""
                    }`}>
                      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                        <Calendar size={20} />
                        {day}
                        {day === currentDay && (
                          <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                            Today
                          </span>
                        )}
                      </h2>
                      <div className="space-y-3">
                        {timetable[day].map((period, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              period.subject === "Break" 
                                ? "bg-muted/30" 
                                : "bg-muted/50 hover:bg-muted/70 transition-colors"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <Clock size={16} className="text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {period.time}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{period.subject}</p>
                              {period.teacher && (
                                <p className="text-sm text-muted-foreground">{period.teacher}</p>
                              )}
                            </div>
                            {period.room && (
                              <div className="text-right">
                                <p className="text-sm font-medium text-primary">{period.room}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 bg-card border-border text-center">
                <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Timetable Available</h3>
                <p className="text-muted-foreground">Your class timetable will appear here once it has been set up by the school administration.</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
