"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRegistration } from "@/contexts/RegistrationContext"

export default function SelectCoursePage() {
  const router = useRouter()
  const { registrationData, updateRegistrationData } = useRegistration()
  
  const [formData, setFormData] = useState({
    category_id: registrationData.category_id || "",
    course_id: registrationData.course_id || "",
    duration: registrationData.duration || "",
  })

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    // Update registration context with course data
    updateRegistrationData({
      category_id: formData.category_id,
      course_id: formData.course_id,
      duration: formData.duration,
    })
    router.push("/register/select-branch")
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-200 items-center justify-center relative overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/select-course-left.png')",
          }}
        />
      </div>

      {/* Right Side - Course Selection Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-black">Select Course</h1>
            <p className="text-gray-500 text-sm">Choose your preferred course and duration to continue.</p>
          </div>

          {/* Course Selection Form */}
          <form onSubmit={handleNextStep} className="space-y-6">
            {/* Select Category */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <Select value={formData.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
                <SelectTrigger className="!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14">
                  <SelectValue placeholder="Select Category" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                  <SelectItem value="1" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Martial Arts</SelectItem>
                  <SelectItem value="2" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Fitness</SelectItem>
                  <SelectItem value="3" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Dance</SelectItem>
                  <SelectItem value="4" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Self Defense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Choose Course */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <Select value={formData.course_id} onValueChange={(value) => handleSelectChange("course_id", value)}>
                <SelectTrigger className="!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14">
                  <SelectValue placeholder="Choose Course" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                  <SelectItem value="1" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Karate</SelectItem>
                  <SelectItem value="2" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Taekwondo</SelectItem>
                  <SelectItem value="3" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Kung Fu</SelectItem>
                  <SelectItem value="4" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Boxing</SelectItem>
                  <SelectItem value="5" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Jiu Jitsu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Duration */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                <SelectTrigger className="!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14">
                  <SelectValue placeholder="Select Duration" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                  <SelectItem value="1" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">1 Month</SelectItem>
                  <SelectItem value="3" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">3 Months</SelectItem>
                  <SelectItem value="6" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">6 Months</SelectItem>
                  <SelectItem value="12" className="!py-3 !px-3 text-base hover:bg-gray-50 rounded-lg cursor-pointer">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Next Step Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl text-lg h-14 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl mt-8"
            >
              NEXT STEP
            </Button>
          </form>

          {/* Step Indicator */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <div className="w-8 h-1 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">5</div>
            </div>
            <span className="text-gray-500 text-sm font-medium">Step 2 of 5 - Course Selection</span>
          </div>

          {/* Social Login */}
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <span className="text-gray-700 font-semibold">Register with Others</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-3 py-4 px-4 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white rounded-xl transition-all duration-200 h-12"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center space-x-3 py-4 px-4 border-2 border-blue-200 hover:border-blue-300 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 h-12"
              >
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">f</span>
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
