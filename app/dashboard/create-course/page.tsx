"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function CreateCoursePage() {
  const router = useRouter()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [formData, setFormData] = useState({
    courseTitle: "",
    martialArtsStyle: "",
    difficultyLevel: "",
    category: "",
    branchSpecificPrice: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccessPopup(true)
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/courses")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-4 lg:space-x-8 min-w-0">
              <div className="flex items-center flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">ROCK</span>
                </div>
              </div>

              <nav className="hidden md:flex space-x-3 lg:space-x-6 overflow-x-auto">
                <a
                  href="#"
                  onClick={() => router.push("/dashboard")}
                  className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-4 text-sm whitespace-nowrap cursor-pointer"
                >
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Branches
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Masters
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Students
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Member ship
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Revenue
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Attendance
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Reports
                </a>
                <MoreHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </nav>
            </div>

            {/* Search and User Controls */}
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Try searching: User Name, Course Name, User ID"
                  className="pl-10 w-64 xl:w-80 bg-gray-50"
                />
              </div>

              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline">Super admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full p-4 lg:p-6">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/courses")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add New Course</span>
          </Button>
        </div>

        {/* Create Course Form */}
        <Card className="max-w-4xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Title</label>
                  <Select
                    value={formData.courseTitle}
                    onValueChange={(value) => setFormData({ ...formData, courseTitle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kung fu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kung-fu">Kung fu</SelectItem>
                      <SelectItem value="karate">Karate</SelectItem>
                      <SelectItem value="taekwondo">Taekwondo</SelectItem>
                      <SelectItem value="boxing">Boxing</SelectItem>
                      <SelectItem value="jiu-jitsu">Jiu Jitsu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Martial Arts Style</label>
                  <Select
                    value={formData.martialArtsStyle}
                    onValueChange={(value) => setFormData({ ...formData, martialArtsStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Karate, BJJ, Muay Thai, etc." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karate-bjj-muay-thai">Karate, BJJ, Muay Thai, etc.</SelectItem>
                      <SelectItem value="traditional-kung-fu">Traditional Kung Fu</SelectItem>
                      <SelectItem value="mixed-martial-arts">Mixed Martial Arts</SelectItem>
                      <SelectItem value="kickboxing">Kickboxing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
                  <Select
                    value={formData.difficultyLevel}
                    onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="entry level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry-level">Entry level</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Beginner/Intermediate/Expert" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Branch Specific Price</label>
                  <Select
                    value={formData.branchSpecificPrice}
                    onValueChange={(value) => setFormData({ ...formData, branchSpecificPrice: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="INR 8500" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr-8500">INR 8500</SelectItem>
                      <SelectItem value="inr-7500">INR 7500</SelectItem>
                      <SelectItem value="inr-9500">INR 9500</SelectItem>
                      <SelectItem value="inr-10000">INR 10000</SelectItem>
                      <SelectItem value="inr-12000">INR 12000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black px-8">
                  Create Course
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Created Successfully!</h3>
              <p className="text-gray-600 mb-6">Your course has been created and added to the system.</p>
              <div className="flex space-x-3">
                <Button onClick={handleSuccessOk} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black">
                  OK
                </Button>
                <Button onClick={handleSuccessOk} variant="outline" className="flex-1 bg-transparent">
                  Back to List
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
