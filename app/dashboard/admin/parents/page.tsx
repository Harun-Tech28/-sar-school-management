"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Search, Mail, Phone, UserCheck, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Parent {
  id: string
  fullName: string
  email: string
  phone: string
  parent: {
    id: string
    occupation: string | null
    children: {
      id: string
      user: {
        fullName: string
      }
    }[]
  } | null
  createdAt: string
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchParents()
  }, [])

  const fetchParents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/parents")
      if (response.ok) {
        const data = await response.json()
        setParents(data)
      }
    } catch (error) {
      console.error("Error fetching parents:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredParents = parents.filter((parent) => {
    const searchLower = searchTerm.toLowerCase().trim()
    if (!searchLower) return true
    
    return (
      (parent.fullName || '').toLowerCase().includes(searchLower) ||
      (parent.email || '').toLowerCase().includes(searchLower) ||
      (parent.phone || '').toLowerCase().includes(searchLower)
    )
  })

  // Calculate real statistics
  const totalParents = parents.length
  const parentsWithChildren = parents.filter(p => p.parent?.children && p.parent.children.length > 0).length
  const totalChildren = parents.reduce((sum, p) => sum + (p.parent?.children?.length || 0), 0)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/parents/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Parent account deleted successfully")
        fetchParents()
      } else {
        toast.error(data.error || "Failed to delete parent account")
      }
    } catch (error) {
      console.error("Error deleting parent:", error)
      toast.error("Failed to delete parent account")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parents Management</h1>
          <p className="text-gray-600 mt-1">Manage parent accounts and information</p>
        </div>
        <Link
          href="/dashboard/admin/parents/add"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add Parent
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Parents</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalParents}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">With Linked Children</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{parentsWithChildren}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Children</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalChildren}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Mail className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search parents by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Children
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading parents...
                  </td>
                </tr>
              ) : filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? "No parents found matching your search" : "No parents registered yet"}
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="text-purple-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{parent.fullName}</div>
                          {parent.parent?.occupation && (
                            <div className="text-xs text-gray-500">{parent.parent.occupation}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {parent.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={14} className="text-gray-400" />
                        {parent.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {parent.parent?.children && parent.parent.children.length > 0 ? (
                          <div className="space-y-1">
                            {parent.parent.children.map((child) => (
                              <div key={child.id} className="text-sm text-gray-600">
                                • {child.user.fullName}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">No children linked</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(parent.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/admin/parents/${parent.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/admin/parents/${parent.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        {parent.parent?.id && (
                          <Link
                            href={`/dashboard/admin/parents/${parent.id}/link-children`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Link Children
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(parent.id, parent.fullName)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          title="Delete parent account"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
