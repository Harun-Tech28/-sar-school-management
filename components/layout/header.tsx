"use client"

import { User, LogOut, Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/components/notifications/notification-bell"

interface HeaderProps {
  userName: string
  userRole: string
  userId: string
}

interface SearchResult {
  id: string
  name: string
  email?: string
  type: 'student' | 'teacher' | 'parent' | 'admin' | 'class'
  additionalInfo?: string
}

export function Header({ userName, userRole, userId }: HeaderProps) {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    try {
      // Search students
      const studentsRes = await fetch('/api/students')
      if (studentsRes.ok) {
        const students = await studentsRes.json()
        const matchedStudents = students.filter((s: any) =>
          s.name?.toLowerCase().includes(lowerQuery) ||
          s.email?.toLowerCase().includes(lowerQuery) ||
          s.id?.toLowerCase().includes(lowerQuery) ||
          s.admissionNumber?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5)
        
        results.push(...matchedStudents.map((s: any) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          type: 'student' as const,
          additionalInfo: s.admissionNumber ? `Admission: ${s.admissionNumber}` : undefined
        })))
      }

      // Search teachers
      const teachersRes = await fetch('/api/teachers')
      if (teachersRes.ok) {
        const teachers = await teachersRes.json()
        const matchedTeachers = teachers.filter((t: any) =>
          t.name?.toLowerCase().includes(lowerQuery) ||
          t.email?.toLowerCase().includes(lowerQuery) ||
          t.id?.toLowerCase().includes(lowerQuery) ||
          t.subject?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5)
        
        results.push(...matchedTeachers.map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          type: 'teacher' as const,
          additionalInfo: t.subject ? `Subject: ${t.subject}` : undefined
        })))
      }

      // Search classes
      const classesRes = await fetch('/api/classes')
      if (classesRes.ok) {
        const classes = await classesRes.json()
        const matchedClasses = classes.filter((c: any) =>
          c.name?.toLowerCase().includes(lowerQuery) ||
          c.id?.toLowerCase().includes(lowerQuery)
        ).slice(0, 5)
        
        results.push(...matchedClasses.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: 'class' as const,
          additionalInfo: c.teacherName ? `Teacher: ${c.teacherName}` : undefined
        })))
      }

      // Search parents (admin only)
      if (userRole === 'admin') {
        const parentsRes = await fetch('/api/parents')
        if (parentsRes.ok) {
          const parents = await parentsRes.json()
          const matchedParents = parents.filter((p: any) =>
            p.name?.toLowerCase().includes(lowerQuery) ||
            p.email?.toLowerCase().includes(lowerQuery) ||
            p.id?.toLowerCase().includes(lowerQuery)
          ).slice(0, 5)
          
          results.push(...matchedParents.map((p: any) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            type: 'parent' as const
          })))
        }
      }

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])

    // Navigate based on type and role
    if (userRole === 'admin') {
      switch (result.type) {
        case 'student':
          router.push(`/dashboard/admin/students/${result.id}`)
          break
        case 'teacher':
          router.push(`/dashboard/admin/teachers/${result.id}`)
          break
        case 'class':
          router.push(`/dashboard/admin/classes/${result.id}`)
          break
        case 'parent':
          router.push(`/dashboard/admin/parents/${result.id}`)
          break
      }
    } else if (userRole === 'teacher') {
      switch (result.type) {
        case 'student':
          router.push(`/dashboard/teacher/students/${result.id}`)
          break
        case 'class':
          router.push(`/dashboard/teacher/classes/${result.id}`)
          break
      }
    }
  }

  return (
    <>
      <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground capitalize">Welcome back, {userName}</h2>
          <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Button - Prominent and visible */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E31E24] to-[#FFD100] hover:from-[#c91a1f] hover:to-[#e6bc00] text-white rounded-lg transition-all shadow-md hover:shadow-lg"
            title="Search users"
          >
            <Search size={18} />
            <span className="font-medium">Search</span>
          </button>

          <NotificationBell userId={userId} userRole={userRole} />
          <button
            onClick={async () => {
              try {
                // Call logout API to clear cookie
                await fetch("/api/auth/logout", {
                  method: "POST",
                })
                // Clear localStorage
                localStorage.removeItem("user")
                // Redirect to home
                window.location.href = "/"
              } catch (error) {
                console.error("Logout error:", error)
                // Still clear localStorage and redirect even if API fails
                localStorage.removeItem("user")
                window.location.href = "/"
              }
            }}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} className="text-destructive" />
          </button>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <User size={20} className="text-primary-foreground" />
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Search Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E31E24] to-[#FFD100] rounded-xl flex items-center justify-center shadow-lg">
                  <Search size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">Search Users</h3>
                  <p className="text-sm text-gray-600">Find students, teachers, parents, or admins</p>
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by name, email, role, or ID..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E31E24] focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Start typing to search</p>
                  <p className="text-sm text-gray-500 mt-2">Search for students, teachers, classes{userRole === 'admin' ? ', or parents' : ''}</p>
                </div>
              ) : isSearching ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No results found</p>
                  <p className="text-sm text-gray-500 mt-2">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
                          result.type === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                          result.type === 'teacher' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          result.type === 'student' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          result.type === 'parent' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                          {result.type === 'class' ? '🏫' : result.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{result.name}</h4>
                          {result.email && <p className="text-sm text-gray-600">{result.email}</p>}
                          {result.additionalInfo && <p className="text-xs text-gray-500 mt-1">{result.additionalInfo}</p>}
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.type === 'admin' ? 'bg-purple-100 text-purple-700' :
                            result.type === 'teacher' ? 'bg-blue-100 text-blue-700' :
                            result.type === 'student' ? 'bg-green-100 text-green-700' :
                            result.type === 'parent' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
