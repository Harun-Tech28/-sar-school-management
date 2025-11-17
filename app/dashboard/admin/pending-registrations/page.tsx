"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserCheck, UserX, Clock, Mail, Phone, Users, Eye } from "lucide-react"

interface PendingUser {
  id: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  createdAt: string
}

export default function PendingRegistrationsPage() {
  const router = useRouter()
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const handleViewProfile = (userId: string) => {
    // Navigate to the pending user profile page
    router.push(`/dashboard/admin/pending-users/${userId}`)
  }

  const fetchPendingUsers = async () => {
    try {
      console.log('[Pending Page] Fetching pending users...')
      setLoading(true)
      const response = await fetch("/api/admin/pending-users")
      console.log('[Pending Page] Response status:', response.status)
      console.log('[Pending Page] Response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[Pending Page] Received data:', data)
        console.log('[Pending Page] Users array:', data.users)
        console.log('[Pending Page] Users count:', data.users?.length)
        setUsers(data.users || [])
      } else {
        console.error('[Pending Page] Response not ok:', response.status)
        const errorData = await response.json()
        console.error('[Pending Page] Error data:', errorData)
      }
    } catch (error) {
      console.error("[Pending Page] Error fetching pending users:", error)
    } finally {
      setLoading(false)
      console.log('[Pending Page] Loading complete')
    }
  }

  const handleApprove = async (userId: string) => {
    if (!confirm("Are you sure you want to approve this user?")) return

    setProcessing(userId)
    try {
      const response = await fetch(`/api/admin/pending-users/${userId}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        // Remove from list FIRST
        setUsers(users.filter(u => u.id !== userId))
        // Then show success message
        setTimeout(() => alert(data.message), 100)
      } else {
        const errorData = await response.json()
        alert(`Failed to approve user: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error("Error approving user:", error)
      alert("An error occurred while approving the user")
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: string) => {
    const reason = prompt("Enter rejection reason (optional):")
    if (reason === null) return // User cancelled

    setProcessing(userId)
    try {
      const response = await fetch(`/api/admin/pending-users/${userId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "No reason provided" }),
      })

      if (response.ok) {
        const data = await response.json()
        // Remove from list FIRST
        setUsers(users.filter(u => u.id !== userId))
        // Then show success message
        setTimeout(() => alert(data.message), 100)
      } else {
        const errorData = await response.json()
        alert(`Failed to reject user: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error("Error rejecting user:", error)
      alert("An error occurred while rejecting the user")
    } finally {
      setProcessing(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "PARENT":
        return "bg-purple-100 text-purple-800"
      case "STUDENT":
        return "bg-blue-100 text-blue-800"
      case "TEACHER":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Registrations</h1>
          <p className="text-gray-600 mt-1">Review and approve new user registrations</p>
        </div>
        <button
          onClick={fetchPendingUsers}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Pending Approvals</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg">
            <Clock className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {/* Pending Users List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading pending registrations...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg font-medium">No pending registrations</p>
            <p className="text-gray-500 text-sm mt-2">All registrations have been processed</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  {/* Clickable user info section */}
                  <div 
                    className="flex-1 cursor-pointer group"
                    onClick={() => handleViewProfile(user.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {user.fullName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      <Eye size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>Registered {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprove(user.id)
                      }}
                      disabled={processing === user.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserCheck size={18} />
                      {processing === user.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReject(user.id)
                      }}
                      disabled={processing === user.id}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserX size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
