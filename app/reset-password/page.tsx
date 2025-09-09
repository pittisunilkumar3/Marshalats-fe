"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState("")
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Get token from URL parameters
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      setTokenValid(true)
    } else {
      setTokenValid(false)
      setError("Invalid or missing reset token. Please request a new password reset.")
    }
  }, [searchParams])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!newPassword.trim()) {
      setError("New password is required")
      return
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!token) {
      setError("Invalid reset token")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully. You can now login with your new password.",
          variant: "default"
        })
      } else {
        throw new Error(data.detail || data.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-200 items-center justify-center relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/reset-password-new.png')",
          }}
        />
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">RESET PASSWORD</h1>
            <p className="text-gray-500 text-sm">
              {tokenValid === false
                ? "Invalid or expired reset link"
                : success
                ? "Password reset successful!"
                : "Enter your new password below"
              }
            </p>
          </div>

          {tokenValid === false ? (
            /* Invalid Token */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Invalid Reset Link</h2>
                <p className="text-gray-600 text-sm">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>
              <div className="space-y-3">
                <Link href="/forgot-password">
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : success ? (
            /* Success Message */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Password Reset Complete!</h2>
                <p className="text-gray-600 text-sm">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                  Continue to Login
                </Button>
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2 relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setError("")
                  }}
                  className={`py-3 bg-gray-50 border-gray-200 rounded-lg text-gray-600 placeholder:text-gray-400 pr-12 ${
                    error ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2 relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError("")
                  }}
                  className={`py-3 bg-gray-50 border-gray-200 rounded-lg text-gray-600 placeholder:text-gray-400 pr-12 ${
                    error ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                </ul>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Reset Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
