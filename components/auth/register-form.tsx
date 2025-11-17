"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthLabel } from "@/lib/password-validation"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "parent",
    password: "",
    confirmPassword: "",
  })
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
    strength: 'weak' as 'weak' | 'medium' | 'strong'
  })
  const [error, setError] = useState("")

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password })
    const validation = validatePassword(password)
    setPasswordValidation(validation)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password
    if (!passwordValidation.isValid) {
      setError("Please fix password requirements before continuing")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        toast.success(data.message || "Registration successful!")
        // Redirect to a success page or login with a message
        router.push("/auth/login?registered=true")
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="middleName" className="block text-sm font-medium text-gray-900 mb-2">
          Middle Name <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <input
          id="middleName"
          type="text"
          placeholder="Michael"
          value={formData.middleName}
          onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
        />
      </div>

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
        <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
          I am registering as a <span className="text-red-600">*</span>
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
        >
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>
        <p className="mt-2 text-xs text-gray-600 flex items-start gap-1">
          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
          <span>Your account will require admin approval before you can login.</span>
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
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
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-600">Password Strength:</span>
              <span className={`text-xs font-semibold ${getPasswordStrengthColor(passwordValidation.strength)}`}>
                {getPasswordStrengthLabel(passwordValidation.strength)}
              </span>
            </div>
            
            {/* Password Requirements */}
            <div className="space-y-1">
              {passwordValidation.errors.map((error, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-red-600">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ))}
              {passwordValidation.isValid && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle size={14} />
                  <span>Password meets all requirements</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}
