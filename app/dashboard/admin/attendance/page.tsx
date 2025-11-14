'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Users, CheckCircle, XCircle, Clock, Save } from 'lucide-react'
import Link from 'next/link'

export default function AdminAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      if (data.success) {
        setClasses(data.data)
        if (data.data.length > 0) {
          setSelectedClass(data.data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/students?classId=${selectedClass}`)
      const data = await response.json()
      
      if (data.success) {
        setStudents(data.data)
        
        // Fetch existing attendance for this date
        const attendanceResponse = await fetch(
          `/api/attendance?classId=${selectedClass}&date=${selectedDate}`
        )
        const attendanceData = await attendanceResponse.json()
        
        if (attendanceData.success && attendanceData.data.length > 0) {
          const attendanceMap: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {}
          attendanceData.data.forEach((record: any) => {
            attendanceMap[record.studentId] = record.status
          })
          setAttendance(attendanceMap)
        } else {
          // Initialize all as present by default
          const initialAttendance: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {}
          data.data.forEach((student: any) => {
            initialAttendance[student.id] = 'PRESENT'
          })
          setAttendance(initialAttendance)
        }
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const markAllPresent = () => {
    const allPresent: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {}
    students.forEach(student => {
      allPresent[student.id] = 'PRESENT'
    })
    setAttendance(allPresent)
  }

  const saveAttendance = async () => {
    if (!selectedClass) {
      setMessage('Please select a class')
      return
    }

    if (students.length === 0) {
      setMessage('No students to mark attendance for')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const attendanceRecords = students.map(student => ({
        studentId: student.id,
        status: attendance[student.id] || 'PRESENT'
      }))

      const response = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          date: selectedDate,
          records: attendanceRecords
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage('✅ Attendance saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        // Handle specific error cases
        if (data.error && data.error.includes('already marked')) {
          setMessage('⚠️ Attendance already exists for this date. Please edit existing records or choose a different date.')
        } else if (data.details) {
          // Validation error
          const errorMsg = data.details.map((e: any) => e.message).join(', ')
          setMessage('❌ Validation error: ' + errorMsg)
        } else {
          setMessage('❌ ' + (data.error || 'Failed to save attendance'))
        }
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      setMessage('❌ Error saving attendance. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800 border-green-300'
      case 'ABSENT': return 'bg-red-100 text-red-800 border-red-300'
      case 'LATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="w-4 h-4" />
      case 'ABSENT': return <XCircle className="w-4 h-4" />
      case 'LATE': return <Clock className="w-4 h-4" />
      default: return null
    }
  }

  const presentCount = Object.values(attendance).filter(s => s === 'PRESENT').length
  const absentCount = Object.values(attendance).filter(s => s === 'ABSENT').length
  const lateCount = Object.values(attendance).filter(s => s === 'LATE').length

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Mark Attendance
          </h1>
          <p className="text-gray-600 mt-2">
            Record daily attendance for your classes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={markAllPresent}
                variant="outline"
                className="w-full"
                disabled={!selectedClass || students.length === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Present
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Student List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedClass ? 'No Students Found' : 'Select a Class'}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedClass 
                ? 'This class has no students enrolled yet.'
                : 'Please select a class to mark attendance.'}
            </p>
            {selectedClass && (
              <Link href="/dashboard/admin/students/add">
                <Button>Add Students</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.user?.fullName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(attendance[student.id] || 'PRESENT')}`}>
                          {getStatusIcon(attendance[student.id] || 'PRESENT')}
                          {attendance[student.id] || 'PRESENT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => markAttendance(student.id, 'PRESENT')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              attendance[student.id] === 'PRESENT'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, 'LATE')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              attendance[student.id] === 'LATE'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() => markAttendance(student.id, 'ABSENT')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              attendance[student.id] === 'ABSENT'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <div>
                {message && (
                  <p className={`text-sm font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </div>
              <Button
                onClick={saveAttendance}
                disabled={saving || students.length === 0}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
