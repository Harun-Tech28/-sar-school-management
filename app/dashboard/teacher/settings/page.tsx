"use client"

import { Card } from "@/components/ui/card"
import { User, Lock, Save, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Profile state
  const [profileData, setProfileData] = useState({
    email: "",
    currentPassword: "",
  })
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ]

  // Load user data on mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          email: data.user.email,
          currentPassword: "",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  // Update email
  const handleUpdateEmail = async () => {
    if (!profileData.currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profileData.email,
          currentPassword: profileData.currentPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Email updated successfully!")
        setProfileData({ ...profileData, currentPassword: "" })
        
        // Update localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        user.email = data.user.email
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        toast.error(data.error || "Failed to update email")
      }
    } catch (error) {
      console.error("Error updating email:", error)
      toast.error("Failed to update email")
    } finally {
      setIsSaving(false)
    }
  }

  // Update password
  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Password updated successfully!")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast.error(data.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Failed to update password")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E31E24] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="p-4 h-fit shadow-lg">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-[#E31E24] text-white font-medium shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">Update your email address</p>
                </div>
                <User className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={profileData.currentPassword}
                    onChange={(e) =>
                      setProfileData({ ...profileData, currentPassword: e.target.value })
                    }
                    placeholder="Enter your current password to confirm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required to update your email
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleUpdateEmail}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Update Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">Change your password</p>
                </div>
                <Lock className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
