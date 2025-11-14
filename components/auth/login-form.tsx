"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Check for registration success message
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('registered') === 'true') {
        setSuccessMessage("Registration successful! Your account is pending admin approval. You'll be notified once approved.")
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", formData.email)
      
      // Use simple login endpoint with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const data = await response.json()
      console.log("Login response:", data)

      if (!response.ok) {
        // Handle specific error codes
        if (data.code === "TIMEOUT") {
          setError("Login timeout. Please check your internet connection and try again.")
        } else if (data.code === "DB_CONNECTION_ERROR") {
          setError("Database connection error. Please contact support if this persists.")
        } else {
          setError(data.error || "Invalid email or password")
        }
        setIsLoading(false)
        return
      }

      if (data.success && data.user) {
        const userRole = data.user.role.toLowerCase()
        console.log("Login successful! Redirecting to:", `/dashboard/${userRole}`)
        
        // Store user data in localStorage as backup
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Use router.push for proper Next.js navigation
        router.push(`/dashboard/${userRole}`)
      } else {
        setError("Login failed. Please try again.")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      
      // Handle network errors
      if (error instanceof Error && error.name === 'AbortError') {
        setError("Request timeout. Please check your connection and try again.")
      } else {
        setError("Network error. Please check your internet connection.")
      }
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@school.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" className="rounded border-gray-300" />
          <span>Remember me</span>
        </label>
        <Link href="/auth/forgot-password" className="text-red-600 hover:text-red-700 font-medium">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
