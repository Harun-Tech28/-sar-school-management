"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, Plus, Edit, Trash2, Save, X } from "lucide-react"
import { toast } from "react-hot-toast"

interface TimetableEntry {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  subject: string
  teacherId?: string
  room?: string
  isBreak: boolean
  teacher?: {
    user: {
      fullName: string
    }
  }
}

interface Class {
  id: string
  name: string
  level: string
}

interface Teacher {
  id: string
  user: {
    fullName: string
  }
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
const TIME_SLOTS = [
  "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", 
  "14:30", "15:00", "15:30", "16:00"
]

export default function AdminTimetablePage() {
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    dayOfWeek: "MONDAY",
    startTime: "08:00",
    endTime: "09:00",
    subject: "",
    teacherId: "",
    room: "",
    isBreak: false
  })

  useEffect(() => {
    fetchClasses()
    fetchTeachers()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable()
    }
  }, [selectedClass])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers || [])
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const fetchTimetable = async () => {
    if (!selectedClass) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/timetable?classId=${selectedClass}`)
      if (response.ok) {
        const data = await response.json()
        setTimetable(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching timetable:", error)
      toast.error("Failed to load timetable")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEntry = async () => {
    if (!selectedClass || !newEntry.subject) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const response = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEntry,
          classId: selectedClass,
          teacherId: newEntry.teacherId || null
        })
      })

      if (response.ok) {
        toast.success("Timetable entry added successfully!")
        setShowAddForm(false)
        setNewEntry({
          dayOfWeek: "MONDAY",
          startTime: "08:00",
          endTime: "09:00",
          subject: "",
          teacherId: "",
          room: "",
          isBreak: false
        })
        fetchTimetable()
      } else {
        toast.error("Failed to add timetable entry")
      }
    } catch (error) {
      console.error("Error adding entry:", error)
      toast.error("Failed to add timetable entry")
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const response = await fetch(`/api/timetable/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Entry deleted successfully!")
        fetchTimetable()
      } else {
        toast.error("Failed to delete entry")
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast.error("Failed to delete entry")
    }
  }

  const getTimetableForDay = (day: string) => {
    return timetable
      .filter(entry => entry.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="text-[#E31E24]" size={32} />
          Timetable Management
        </h1>
        <p className="text-gray-600 mt-2">
          Create and manage class timetables for the academic year
        </p>
      </div>

      {/* Class Selection */}
      <Card className="p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Select Class</h2>
          {selectedClass && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all"
            >
              <Plus size={18} />
              Add Entry
            </button>
          )}
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent"
        >
          <option value="">Select a class...</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} - {cls.level}
            </option>
          ))}
        </select>
      </Card>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card className="p-6 mb-6 shadow-lg border-l-4 border-[#E31E24]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Add New Entry</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Day</label>
              <select
                value={newEntry.dayOfWeek}
                onChange={(e) => setNewEntry({...newEntry, dayOfWeek: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E31E24]"
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <select
                value={newEntry.startTime}
                onChange={(e) => setNewEntry({...newEntry, startTime: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E31E24]"
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">End Time</label>
              <select
                value={newEntry.endTime}
                onChange={(e) => setNewEntry({...newEntry, endTime: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E31E24]"
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <input
                type="text"
                value={newEntry.subject}
                onChange={(e) => setNewEntry({...newEntry, subject: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E31E24]"
                placeholder="Enter subject name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Teacher</label>
              <select
                value={newEntry.teacherId}
                onChange={(e) => setNewEntry({...newEntry, teacherId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E31E24]"
              >
                <option value="">Select teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.user.fullName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Room</label>
              <input
                type="text"
                value={newEntry.room}
                onChange={(e) => setNewEntry({...newEntry, room: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E31E24]"
                placeholder="Room number"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newEntry.isBreak}
                onChange={(e) => setNewEntry({...newEntry, isBreak: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm">This is a break period</span>
            </label>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddEntry}
              className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all"
            >
              <Save size={18} />
              Add Entry
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Timetable Display */}
      {selectedClass && (
        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="text-[#E31E24]" size={24} />
            Weekly Timetable
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {DAYS.map(day => (
                <div key={day} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-center mb-3 text-[#E31E24] border-b pb-2">
                    {day}
                  </h4>
                  <div className="space-y-2">
                    {getTimetableForDay(day).map(entry => (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-lg text-sm ${
                          entry.isBreak 
                            ? "bg-yellow-100 border-yellow-300" 
                            : "bg-blue-50 border-blue-200"
                        } border`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs text-gray-600">
                            {entry.startTime} - {entry.endTime}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-800">
                          {entry.subject}
                        </div>
                        {entry.teacher && (
                          <div className="text-xs text-gray-600 mt-1">
                            {entry.teacher.user.fullName}
                          </div>
                        )}
                        {entry.room && (
                          <div className="text-xs text-gray-500">
                            Room: {entry.room}
                          </div>
                        )}
                      </div>
                    ))}
                    {getTimetableForDay(day).length === 0 && (
                      <div className="text-center text-gray-400 py-4 text-sm">
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {!selectedClass && (
        <Card className="p-12 text-center shadow-lg">
          <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Select a Class to Manage Timetable
          </h3>
          <p className="text-gray-500">
            Choose a class from the dropdown above to view and edit its timetable
          </p>
        </Card>
      )}
    </div>
  )
}
