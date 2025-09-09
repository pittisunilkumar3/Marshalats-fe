"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast({
          title: "Reset Link Sent",
          description: "If an account with that email exists, a password reset link has been sent.",
          variant: "default"
        })
      } else {
        throw new Error(data.detail || data.message || 'Failed to send reset link')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError(error instanceof Error ? error.message : 'Failed to send reset link. Please try again.')
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
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
            backgroundImage: "url('/images/forgot-password-left.png')",
          }}
        />
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Back to login link */}
        <div className="absolute top-8 right-8">
          <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to login</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">FORGOT PASSWORD</h1>
            <p className="text-gray-500 text-sm">
              {success
                ? "Check your email for reset instructions"
                : "No worries, we will send you reset instructions"
              }
            </p>
          </div>

          {success ? (
            /* Success Message */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Email Sent!</h2>
                <p className="text-gray-600 text-sm">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <p className="text-gray-500 text-xs">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Different Email
                </Button>
                <Link href="/login">
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleResetRequest} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your registered email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className={`py-3 bg-gray-50 border-gray-200 rounded-lg text-gray-600 placeholder:text-gray-400 ${
                    error ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                  disabled={loading}
                />
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>

              {/* Reset Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
