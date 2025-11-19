"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TestHomeworkPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testCreateHomework = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      // First, get a teacher
      const teacherRes = await fetch("/api/teachers")
      const teacherData = await teacherRes.json()
      
      if (!teacherData.success || teacherData.data.length === 0) {
        setResult({ error: "No teachers found" })
        setLoading(false)
        return
      }
      
      const teacher = teacherData.data[0]
      
      // Get teacher's classes
      const classesRes = await fetch(`/api/teachers/me/classes?teacherId=${teacher.id}`)
      const classesData = await classesRes.json()
      
      if (!classesData.success || classesData.data.length === 0) {
        setResult({ error: "No classes found for teacher" })
        setLoading(false)
        return
      }
      
      const classId = classesData.data[0].id
      
      // Create homework
      const homeworkData = {
        title: `Test Homework ${new Date().toISOString()}`,
        description: "This is a test homework assignment",
        subject: "Mathematics",
        classId: classId,
        teacherId: teacher.id,
        dueDate: "2025-12-31",
      }
      
      console.log("Creating homework with data:", homeworkData)
      
      const res = await fetch("/api/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeworkData),
      })
      
      const data = await res.json()
      
      setResult({
        status: res.status,
        success: data.success,
        data: data,
        teacherInfo: teacher,
        classInfo: classesData.data[0],
      })
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testGetHomework = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch("/api/homework")
      const data = await res.json()
      
      setResult({
        status: res.status,
        success: data.success,
        count: data.data?.length || 0,
        data: data,
      })
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Homework System Test Page</h1>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="flex gap-4">
            <Button onClick={testGetHomework} disabled={loading}>
              Test GET Homework
            </Button>
            <Button onClick={testCreateHomework} disabled={loading}>
              Test CREATE Homework
            </Button>
          </div>
        </Card>

        {loading && (
          <Card className="p-6">
            <p>Loading...</p>
          </Card>
        )}

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}

        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Test GET Homework" to fetch all homework</li>
            <li>Click "Test CREATE Homework" to create a new homework assignment</li>
            <li>Check the result below to see if it worked</li>
            <li>If successful, the homework system is working correctly</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
