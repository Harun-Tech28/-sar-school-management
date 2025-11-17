"use client"

import { Card } from "@/components/ui/card"
import { User, Lock, Bell, Globe, Shield, Database, Save, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

interface ProfileData {
  fullName: string
  email: string
  phone: string
}

interface SecurityData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  announcementAlerts: boolean
}

interface PreferenceSettings {
  language: string
  timezone: string
  dateFormat: string
}

interface PrivacySettings {
  profileVisibility: boolean
  activityStatus: boolean
  dataSharing: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "SAR Administrator",
    email: "admin@sar.edu",
    phone: "+233 24 000 0000"
  })
  
  // Security state
  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    announcementAlerts: true
  })
  
  // Preferences state
  const [preferences, setPreferences] = useState<PreferenceSettings>({
    language: "English",
    timezone: "GMT (Ghana)",
    dateFormat: "DD/MM/YYYY"
  })
  
  // Privacy state
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: true,
    activityStatus: true,
    dataSharing: false
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "system", label: "System", icon: Database },
  ]

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      if (parsed.profile) setProfileData(parsed.profile)
      if (parsed.notifications) setNotifications(parsed.notifications)
      if (parsed.preferences) setPreferences(parsed.preferences)
      if (parsed.privacy) setPrivacy(parsed.privacy)
    }
  }, [])

  // Save profile
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Validate email
      if (!profileData.email.includes('@')) {
        toast.error('Please enter a valid email address')
        setIsSaving(false)
        return
      }

      // Save to localStorage (in production, this would be an API call)
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
      localStorage.setItem('userSettings', JSON.stringify({
        ...currentSettings,
        profile: profileData
      }))

      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.fullName = profileData.fullName
      user.email = profileData.email
      localStorage.setItem('user', JSON.stringify(user))

      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Profile updated successfully!')
      setHasChanges(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  // Save security
  const handleUpdatePassword = async () => {
    setIsSaving(true)
    try {
      if (!securityData.currentPassword) {
        toast.error('Please enter your current password')
        setIsSaving(false)
        return
      }

      if (securityData.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters')
        setIsSaving(false)
        return
      }

      if (securityData.newPassword !== securityData.confirmPassword) {
        toast.error('Passwords do not match')
        setIsSaving(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Password updated successfully!')
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast.error('Failed to update password')
    } finally {
      setIsSaving(false)
    }
  }

  // Save notifications
  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
      localStorage.setItem('userSettings', JSON.stringify({
        ...currentSettings,
        notifications
      }))

      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Notification preferences saved!')
      setHasChanges(false)
    } catch (error) {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  // Save preferences
  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
      localStorage.setItem('userSettings', JSON.stringify({
        ...currentSettings,
        preferences
      }))

      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Preferences saved successfully!')
      setHasChanges(false)
    } catch (error) {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  // Save privacy
  const handleSavePrivacy = async () => {
    setIsSaving(true)
    try {
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
      localStorage.setItem('userSettings', JSON.stringify({
        ...currentSettings,
        privacy
      }))

      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Privacy settings saved!')
      setHasChanges(false)
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
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
                  <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
                </div>
                <User className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => {
                      setProfileData({ ...profileData, fullName: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => {
                      setProfileData({ ...profileData, email: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => {
                      setProfileData({ ...profileData, phone: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  {hasChanges && !isSaving && (
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your password and security</p>
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
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
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
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
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
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
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

          {activeTab === "notifications" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose how you want to be notified</p>
                </div>
                <Bell className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                {[
                  { key: "emailNotifications", label: "Email Notifications", description: "Receive email updates about important events" },
                  { key: "smsNotifications", label: "SMS Notifications", description: "Get text messages for urgent alerts" },
                  { key: "pushNotifications", label: "Push Notifications", description: "Browser notifications for real-time updates" },
                  { key: "announcementAlerts", label: "Announcement Alerts", description: "Notify me when new announcements are posted" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#E31E24] transition-all">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications[item.key as keyof NotificationSettings]}
                        onChange={(e) => {
                          setNotifications({ ...notifications, [item.key]: e.target.checked })
                          setHasChanges(true)
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E31E24]"></div>
                    </label>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Preferences
                      </>
                    )}
                  </button>
                  {hasChanges && !isSaving && (
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Preferences</h2>
                  <p className="text-sm text-gray-600 mt-1">Customize your experience</p>
                </div>
                <Globe className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select 
                    value={preferences.language}
                    onChange={(e) => {
                      setPreferences({ ...preferences, language: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  >
                    <option>English</option>
                    <option>Twi</option>
                    <option>Ga</option>
                    <option>Ewe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select 
                    value={preferences.timezone}
                    onChange={(e) => {
                      setPreferences({ ...preferences, timezone: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  >
                    <option>GMT (Ghana)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select 
                    value={preferences.dateFormat}
                    onChange={(e) => {
                      setPreferences({ ...preferences, dateFormat: e.target.value })
                      setHasChanges(true)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E31E24] focus:border-transparent transition-all"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={handleSavePreferences}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Preferences
                      </>
                    )}
                  </button>
                  {hasChanges && !isSaving && (
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Privacy Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">Control your privacy and data</p>
                </div>
                <Shield className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                {[
                  { key: "profileVisibility", label: "Profile Visibility", description: "Control who can see your profile information" },
                  { key: "activityStatus", label: "Activity Status", description: "Show when you're online" },
                  { key: "dataSharing", label: "Data Sharing", description: "Share anonymous usage data to improve the system" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#E31E24] transition-all">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={privacy[item.key as keyof PrivacySettings]}
                        onChange={(e) => {
                          setPrivacy({ ...privacy, [item.key]: e.target.checked })
                          setHasChanges(true)
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E31E24]"></div>
                    </label>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={handleSavePrivacy}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-[#E31E24] text-white rounded-lg hover:bg-[#c91a1f] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Settings
                      </>
                    )}
                  </button>
                  {hasChanges && !isSaving && (
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "system" && (
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">System Information</h2>
                  <p className="text-sm text-gray-600 mt-1">View system details and status</p>
                </div>
                <Database className="text-[#E31E24]" size={24} />
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Version</p>
                  <p className="font-semibold text-gray-900 text-lg">1.0.0</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Database</p>
                  <p className="font-semibold text-gray-900 text-lg">Neon PostgreSQL</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="font-semibold text-gray-900 text-lg">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <p className="text-sm text-green-800 font-medium">
                      System Status: <span className="font-bold">Operational</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🎓 <strong>SAR Educational Complex</strong> - Production Ready
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    All systems operational and ready for use
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
