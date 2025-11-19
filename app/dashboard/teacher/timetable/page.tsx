"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, BookOpen, MapPin, Users } from "lucide-react"
import { toast } from "react-hot-toast"

interface TimetableEntry {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  subject: string
  room?: string
  isBreak: boolean
  class: {
    name: string
    level: string
  }
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
const DAY_NAMES = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday", 
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday"
}

export default function TeacherTimetablePage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [teacherId, setTeacherId] = useState<string | null>(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.email) {
      window.location.href = "/"
      return
    }
    setUserName(user.fullName || user.email.split("@")[0])
    setUserId(user.id || user.email)
    
    // Get teacher ID - try multiple possible locations
    const tid = user.teacherId || user.id
    console.log("Teacher ID:", tid, "User:", user)
    if (tid) {
      setTeacherId(tid)
    } else {
      setIsLoading(false)
      toast.error("Teacher ID not found. Please contact administrator.")
    }
  }, [])

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!teacherId) {
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await fetch(`/api/timetable/teacher/${teacherId}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          setTimetable(data.data || [])
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("API Error:", errorData)
          toast.error("Failed to load timetable")
        }
      } catch (error: any) {
        clearTimeout(timeoutId)
        if (error.name === 'AbortError') {
          console.error("Request timeout")
          toast.error("Request timed out. Please try again.")
        } else {
          console.error("Error fetching timetable:", error)
          toast.error("Failed to load timetable")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (teacherId) {
      fetchTimetable()
    }
  }, [teacherId])

  const getTimetableForDay = (day: string) => {
    return timetable
      .filter(entry => entry.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getCurrentDayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    return getTimetableForDay(today)
  }

  const getNextClass = () => {
    const todayClasses = getCurrentDayClasses()
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    return todayClasses.find(cls => cls.startTime > currentTime)
  }

  const getTotalClassesToday = () => {
    return getCurrentDayClasses().filter(cls => !cls.isBreak).length
  }

  const getTotalClassesThisWeek = () => {
    return timetable.filter(cls => !cls.isBreak).length
  }

  const nextClass = getNextClass()

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar userRole="teacher" />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole="Teacher" userId={userId} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Calendar className="text-[#E31E24]" size={32} />
                My Teaching Schedule
              </h1>
              <p className="text-muted-foreground mt-2">
                View your weekly teaching schedule and upcoming classes
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Classes Today</p>
                    <p className="text-2xl font-bold text-[#E31E24]">{getTotalClassesToday()}</p>
                  </div>
                  <BookOpen className="text-[#E31E24]" size={32} />
                </div>
              </Card>
              
              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Classes This Week</p>
                    <p className="text-2xl font-bold text-[#E31E24]">{getTotalClassesThisWeek()}</p>
                  </div>
                  <Calendar className="text-[#E31E24]" size={32} />
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Class</p>
                    <p className="text-lg font-bold text-foreground">
                      {nextClass ? nextClass.startTime : "No more classes"}
                    </p>
                  </div>
                  <Clock className="text-[#E31E24]" size={32} />
                </div>
              </Card>
            </div>

            {/* Next Class Card */}
            {nextClass && (
              <Card className="p-6 mb-6 shadow-lg border-l-4 border-[#E31E24]">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="text-[#E31E24]" size={20} />
                  Next Class
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-foreground">{nextClass.subject}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {nextClass.startTime} - {nextClass.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {nextClass.class.name} - {nextClass.class.level}
                      </span>
                      {nextClass.room && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          Room {nextClass.room}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#E31E24]">
                      {nextClass.startTime}
                    </div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Weekly Timetable */}
            <Card className="p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="text-[#E31E24]" size={24} />
                Weekly Teaching Schedule
              </h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent"></div>
                </div>
              ) : timetable.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  {DAYS.map(day => {
                    const dayClasses = getTimetableForDay(day)
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() === day
                    
                    return (
                      <div key={day} className={`border rounded-lg p-4 ${
                        isToday ? 'border-[#E31E24] bg-red-50' : 'border-border'
                      }`}>
                        <h4 className={`font-semibold text-center mb-3 border-b pb-2 ${
                          isToday ? 'text-[#E31E24] border-[#E31E24]' : 'text-foreground border-border'
                        }`}>
                          {DAY_NAMES[day as keyof typeof DAY_NAMES]}
                          {isToday && <span className="text-xs ml-2 bg-[#E31E24] text-white px-2 py-1 rounded-full">Today</span>}
                        </h4>
                        <div className="space-y-2">
                          {dayClasses.map(entry => {
                            const now = new Date()
                            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
                            const isCurrentClass = isToday && currentTime >= entry.startTime && currentTime <= entry.endTime
                            
                            return (
                              <div
                                key={entry.id}
                                className={`p-3 rounded-lg text-sm border ${
                                  isCurrentClass
                                    ? "bg-[#E31E24] text-white border-[#E31E24]"
                                    : entry.isBreak 
                                      ? "bg-yellow-100 border-yellow-300 text-yellow-800" 
                                      : "bg-green-50 border-green-200 text-green-800"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`font-medium text-xs ${
                                    isCurrentClass ? 'text-white' : 'text-muted-foreground'
                                  }`}>
                                    {entry.startTime} - {entry.endTime}
                                  </span>
                                  {isCurrentClass && (
                                    <span className="text-xs bg-white text-[#E31E24] px-2 py-1 rounded-full font-medium">
                                      Now
                                    </span>
                                  )}
                                </div>
                                <div className={`font-semibold ${
                                  isCurrentClass ? 'text-white' : 'text-foreground'
                                }`}>
                                  {entry.subject}
                                </div>
                                <div className={`text-xs mt-1 ${
                                  isCurrentClass ? 'text-gray-200' : 'text-muted-foreground'
                                }`}>
                                  {entry.class.name} - {entry.class.level}
                                </div>
                                {entry.room && (
                                  <div className={`text-xs ${
                                    isCurrentClass ? 'text-gray-200' : 'text-muted-foreground'
                                  }`}>
                                    Room: {entry.room}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                          {dayClasses.length === 0 && (
                            <div className="text-center text-muted-foreground py-4 text-sm">
                              No classes scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto text-muted-foreground mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No Teaching Schedule Available
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your teaching schedule will appear here once timetables have been assigned by the administration.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
