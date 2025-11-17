"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, Calendar, User, Shield, CheckCircle, XCircle } from "lucide-react"

interface PendingUserDetails {
  id: string
  email: string
  fullName: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  accountStatus: string
  createdAt: string
}

export default function PendingUserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<PendingUserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/pending-users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        alert("Failed to load user details")
        router.back()
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      alert("Error loading user details")
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm(`Are you sure you want to approve ${user?.fullName}?`)) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/pending-users/${userId}/approve`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        router.push("/dashboard/admin/pending-registrations")
      } else {
        const errorData = await response.json()
        alert(`Failed to approve: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error("Error approving user:", error)
      alert("An error occurred while approving the user")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason (optional):")
    if (reason === null) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/pending-users/${userId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "No reason provided" }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        router.push("/dashboard/admin/pending-registrations")
      } else {
        const errorData = await response.json()
        alert(`Failed to reject: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error("Error rejecting user:", error)
      alert("An error occurred while rejecting the user")
    } finally {
      setProcessing(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case "PARENT":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "STUDENT":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "TEACHER":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">User not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending User Profile</h1>
            <p className="text-gray-600 mt-1">Review registration details</p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user.fullName}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  {user.accountStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={20} className="text-primary" />
                Personal Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <p className="text-gray-900 font-medium">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <p className="text-gray-900 font-medium">{user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{user.fullName}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail size={20} className="text-primary" />
                Contact Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="text-gray-900 font-medium">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Account Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <p className="text-gray-900 font-medium">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Account Status</label>
                  <p className="text-gray-900 font-medium">{user.accountStatus}</p>
                </div>
              </div>
            </div>

            {/* Registration Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                Registration Information
              </h3>
              <div className="space-y-3 pl-7">
                <div>
                  <label className="text-sm text-gray-500">Registration Date</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Registration Time</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-8 py-6 flex items-center justify-end gap-4 border-t">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={18} />
            {processing ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={18} />
            {processing ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  )
}
