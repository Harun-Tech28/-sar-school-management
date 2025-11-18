"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, Plus, Trash2, Edit } from "lucide-react"
import { toast } from "react-hot-toast"

interface TimetableEntry {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  subject: string
  teacherId?: string
  teacher?: { user: { fullName: string } }
  room?: string
  isBreak: boolean
}

export default function AdminTimetablePage() {
  const [classes, setClasses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [formData, setFormData] = useState({
    dayOfWeek: "MONDAY",
    startTime: "08:00",
    endTime: "09:00",
    subject: "",
    teacherId: "",
    room: "",
    isBreak: false,
  })

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

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
      const response = await fetch("/api/classes?limit=1000")
      if (response.ok) {
        const data = await response.json()
        setClasses(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchTeachers = async () => {
