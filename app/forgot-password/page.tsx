"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [mobileNumber, setMobileNumber] = useState("")
  const router = useRouter()

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle reset password logic here
    console.log("Reset password request for:", mobileNumber)
    router.push("/reset-password")
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
            <p className="text-gray-500 text-sm">No worries, We will send you reset instruction</p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleResetRequest} className="space-y-6">
            {/* Mobile Number Field */}
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Enter Register mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="py-3 bg-gray-50 border-gray-200 rounded-lg text-gray-600 placeholder:text-gray-400"
              />
            </div>

            {/* Reset Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-lg"
            >
              Request Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
