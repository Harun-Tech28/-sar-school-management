"use client"

import { useState } from "react"

export default function TestPendingAPIPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      console.log('Testing API...')
      const response = await fetch('/api/admin/pending-users')
      console.log('Response:', response)
      
      const data = await response.json()
      console.log('Data:', data)
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data
      })
    } catch (error) {
      console.error('Error:', error)
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Pending Users API</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Test API" button</li>
          <li>Check the result below</li>
          <li>Open browser console (F12) for detailed logs</li>
          <li>Check terminal/server logs for API logs</li>
        </ol>
      </div>
    </div>
  )
}
