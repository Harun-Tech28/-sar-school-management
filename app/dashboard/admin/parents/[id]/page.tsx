"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, User, Users, Calendar, Edit } from "lucide-react"
import Link from "next/link"

interface ParentDetails {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  accountStatus: string
  createdAt: string
  parent: {
    id: string
    phone: string
    occupation: string | null
    children: {
      id: string
      rollNumber: string
      user: {
        id: string
        fullName: string
        email: string
      }
      class: {
        id: string
        name: string
        form: string
      } | null
    }[]
  } | null
}

export default function ParentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [parent, setParent] = useState<ParentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchParentDetails()
    }
  }, [params.id])

  const fetchParentDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/parents/${params.id}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", response.status, errorData)
        throw new Error(errorData.error || "Failed to fetch parent details")
      }
      
      const data = await response.json()
      setParent(data)
    } catch (error) {
      console.error("Error fetching parent:", error)
      setError(error instanceof Error ? error.message : "Failed to load parent details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading parent details...</div>
        </div>
      </div>
    )
  }

  if (error || !parent) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || "Parent not found"}</p>
          <Link
            href="/dashboard/admin/parents"
            className="text-red-600 hover:text-red-800 mt-2 inline-block"
          >
            ← Back to Parents
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/parents"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Details</h1>
            <p className="text-gray-600 mt-1">View parent information and linked children</p>
          </div>
        </div>
        <Link
          href={`/dashboard/admin/parents/${parent.id}/edit`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Edit size={20} />
          Edit Parent
        </Link>
      </div>

      {/* Parent Information Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <User className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-base font-medium text-gray-900">{parent.fullName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Mail className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-base font-medium text-gray-900">{parent.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Phone className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-base font-medium text-gray-900">{parent.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Registered</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(parent.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {parent.parent?.occupation && (
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <User className="text-indigo-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupation</p>
                <p className="text-base font-medium text-gray-900">{parent.parent.occupation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Children Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Linked Children</h2>
          </div>
          <Link
            href={`/dashboard/admin/parents/${parent.id}/link-children`}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Users size={16} />
            Link Children
          </Link>
        </div>

        {parent.parent && parent.parent.children && parent.parent.children.length > 0 ? (
          <div className="space-y-4">
            {parent.parent.children.map((child) => (
              <div
                key={child.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{child.user.fullName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Roll Number: {child.rollNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Class: {child.class ? `${child.class.name} (${child.class.form})` : 'No class assigned'}
                    </p>
                    <p className="text-sm text-gray-600">Email: {child.user.email}</p>
                  </div>
                  <Link
                    href={`/dashboard/admin/students/${child.user.id}`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    View Student →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No children linked to this parent</p>
            <Link
              href={`/dashboard/admin/parents/${parent.id}/link-children`}
              className="inline-block mt-4 text-primary hover:text-primary/80 font-medium"
            >
              Link a child now →
            </Link>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h2>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            parent.accountStatus === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : parent.accountStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
            {parent.accountStatus}
          </span>
          <span className="text-gray-600">Role: {parent.role}</span>
        </div>
      </div>
    </div>
  )
}
