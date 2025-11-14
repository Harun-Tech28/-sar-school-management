'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, Plus, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export default function TestNotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [apiResponse, setApiResponse] = useState<any>(null)

  const testGetNotifications = async () => {
    try {
      setLoading(true)
      setMessage('Fetching notifications...')
      
      const response = await fetch('/api/notifications')
      const result = await response.json()
      
      setApiResponse(result)
      
      if (result.success) {
        setMessage(`✅ Found ${result.data.length} notifications (${result.unreadCount} unread)`)
      } else {
        setMessage('❌ Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('❌ Error fetching notifications')
      setApiResponse({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const createInfoNotification = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Info Notification',
          message: `Created at ${new Date().toLocaleTimeString()}`,
          type: 'info'
        })
      })
      
      const result = await response.json()
      setApiResponse(result)
      
      if (result.success) {
        setMessage('✅ Info notification created!')
      }
    } catch (error) {
      setMessage('❌ Error creating notification')
    } finally {
      setLoading(false)
    }
  }

  const createWarningNotification = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Budget Alert',
          message: 'Department budget has exceeded 90% utilization',
          type: 'warning'
        })
      })
      
      const result = await response.json()
      setApiResponse(result)
      
      if (result.success) {
        setMessage('⚠️ Warning notification created!')
      }
    } catch (error) {
      setMessage('❌ Error creating notification')
    } finally {
      setLoading(false)
    }
  }

  const createSuccessNotification = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Payment Received',
          message: 'Fee payment of GHS 750 received successfully',
          type: 'success'
        })
      })
      
      const result = await response.json()
      setApiResponse(result)
      
      if (result.success) {
        setMessage('💰 Success notification created!')
      }
    } catch (error) {
      setMessage('❌ Error creating notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notification System Test
          </h1>
          <p className="text-gray-600">
            Test the notification API endpoints and verify functionality
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            API Tests
          </h2>
          
          <div className="space-y-4">
            <div>
              <Button 
                onClick={testGetNotifications}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test GET /api/notifications'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={createInfoNotification}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                Create Info
              </Button>
              
              <Button 
                onClick={createWarningNotification}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <AlertTriangle className="w-4 h-4" />
                Create Warning
              </Button>
              
              <Button 
                onClick={createSuccessNotification}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4" />
                Create Success
              </Button>
            </div>
          </div>
          
          {message && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">{message}</p>
            </div>
          )}
        </div>

        {apiResponse && (
          <div className="bg-gray-50 rounded-lg border p-6">
            <h3 className="font-semibold mb-2">API Response:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium mb-2 text-yellow-900">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
            <li>Click "Test GET /api/notifications" to fetch current notifications</li>
            <li>Click any "Create" button to add a new notification</li>
            <li>Check the API response below to verify the data</li>
            <li>Look at the notification bell in the header (if integrated)</li>
            <li>Verify the notification count badge updates</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
