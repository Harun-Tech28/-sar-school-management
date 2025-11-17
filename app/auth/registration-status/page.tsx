"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, XCircle, Clock, AlertCircle, Mail, Search } from "lucide-react"

export default function RegistrationStatusPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    found: boolean
    accountStatus?: string
    fullName?: string
    role?: string
    rejectionReason?: string
    createdAt?: string
  } | null>(null)
  const [error, setError] = useState("")

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setStatus(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/auth/check-status?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setStatus({
          found: true,
          accountStatus: data.user.accountStatus,
          fullName: data.user.fullName,
          role: data.user.role,
          rejectionReason: data.user.rejectionReason,
          createdAt: data.user.createdAt
        })
      } else {
        setStatus({ found: false })
      }
    } catch (error) {
      console.error("Error checking status:", error)
      setError("An error occurred while checking your status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (!status || !status.found) return null

    switch (status.accountStatus) {
      case "PENDING":
        return <Clock className="w-16 h-16 text-orange-500" />
      case "ACTIVE":
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case "REJECTED":
        return <XCircle className="w-16 h-16 text-red-500" />
      default:
        return <AlertCircle className="w-16 h-16 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    if (!status || !status.found) return "gray"

    switch (status.accountStatus) {
      case "PENDING":
        return "orange"
      case "ACTIVE":
        return "green"
      case "REJECTED":
        return "red"
      default:
        return "gray"
    }
  }

  const getStatusMessage = () => {
    if (!status || !status.found) return null

    switch (status.accountStatus) {
      case "PENDING":
        return {
          title: "Registration Pending",
          message: "Your registration is currently under review by our admin team. This typically takes 1-2 business days.",
          action: "You'll be able to login once your account is approved."
        }
      case "ACTIVE":
        return {
          title: "Account Approved!",
          message: "Great news! Your account has been approved and is now active.",
          action: "You can now login and access the system."
        }
      case "REJECTED":
        return {
          title: "Registration Rejected",
          message: status.rejectionReason || "Your registration was not approved.",
          action: "Please contact the school administration for more information or to reapply."
        }
      default:
        return {
          title: "Unknown Status",
          message: "We couldn't determine your account status.",
          action: "Please contact support for assistance."
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E31E24] via-[#FFD100] to-[#FF6B6B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* SAR Logo and Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sarlogo-xxAG87QJUVXBfV9KkmRbyQ4NK6e1Dm.jpg"
                alt="SAR Educational Complex Logo"
                width={100}
                height={100}
                className="rounded-2xl shadow-2xl relative transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">SAR Educational Complex</h1>
          <p className="text-white/90 text-lg font-medium">Check Registration Status</p>
        </div>

        {/* Status Check Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#E31E24] to-[#FFD100] rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Check Your Status</h2>
              <p className="text-gray-600 text-sm">Enter your email to check registration status</p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleCheckStatus} className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Check
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Status Result */}
          {status && !status.found && (
            <div className="p-6 rounded-xl bg-gray-50 border-2 border-gray-200 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Registration Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find a registration with this email address.
              </p>
              <Link
                href="/auth/signup"
                className="inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Register Now
              </Link>
            </div>
          )}

          {status && status.found && (
            <div className={`p-6 rounded-xl bg-${getStatusColor()}-50 border-2 border-${getStatusColor()}-200`}>
              <div className="flex flex-col items-center text-center mb-6">
                {getStatusIcon()}
                <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                  {getStatusMessage()?.title}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">{status.fullName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Role: <span className="font-medium capitalize">{status.role}</span>
                </p>
                {status.createdAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Registered: {new Date(status.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className={`p-4 rounded-lg bg-white border border-${getStatusColor()}-200 mb-4`}>
                <p className="text-gray-700 mb-2">{getStatusMessage()?.message}</p>
                <p className="text-sm text-gray-600 font-medium">{getStatusMessage()?.action}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                {status.accountStatus === "ACTIVE" && (
                  <Link
                    href="/auth/login"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    Login Now
                  </Link>
                )}
                {status.accountStatus === "REJECTED" && (
                  <Link
                    href="/auth/signup"
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    Register Again
                  </Link>
                )}
                {status.accountStatus === "PENDING" && (
                  <button
                    onClick={() => handleCheckStatus(new Event("submit") as any)}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition"
                  >
                    Refresh Status
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Need Help?</p>
                <p className="text-xs text-blue-700">
                  If you have questions about your registration status, please contact the school administration at{" "}
                  <a href="mailto:admin@sareducational.com" className="underline font-medium">
                    admin@sareducational.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition">
              ← Back to Login
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
              Home →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-xs">
          <p className="font-medium">📍 Box 130, Sepe Sote, Hospital Junction, Kumasi</p>
          <p className="mt-2">© 2025 SAR Educational Complex. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
