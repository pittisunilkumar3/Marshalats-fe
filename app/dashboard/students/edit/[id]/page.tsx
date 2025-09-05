"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, useParams } from "next/navigation"

export default function EditStudent() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    contactNumber: "",
    gender: "",
    dob: "",
    address: "",
    area: "",
    city: "",
    state: "",
    selectBranch: "",
    selectCourse: "",
    experienceLevel: "",
    injuriesHealthNotes: "",
    beltRank: "",
    selectSlot: "",
    joiningDate: "",
    paymentPlan: "full",
  })

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const mockStudentData = {
      firstName: "Uday",
      lastName: "Kumar",
      emailId: "uday.kumar@email.com",
      contactNumber: "9848123456",
      gender: "male",
      dob: "1995-05-15",
      address: "928a/123",
      area: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      selectBranch: "madhapur",
      selectCourse: "kick-boxing",
      experienceLevel: "entry-level",
      injuriesHealthNotes: "asthma",
      beltRank: "white",
      selectSlot: "morning",
      joiningDate: "2024-01-15",
      paymentPlan: "emi",
    }
    setFormData(mockStudentData)
  }, [studentId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccessPopup(true)
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/students")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8 min-w-0">
              <div className="flex items-center flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">ROCK</span>
                </div>
              </div>

              <nav className="hidden md:flex space-x-3 lg:space-x-6 overflow-x-auto">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Branches
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Masters
                </a>
                <a
                  href="#"
                  className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-4 text-sm whitespace-nowrap"
                >
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

      {/* Main Content */}
      <main className="w-full p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit student</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/students")}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to student List
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Uday Kumar"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Ch"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emailId">Email ID</Label>
              <Input
                id="emailId"
                type="email"
                value={formData.emailId}
                onChange={(e) => handleInputChange("emailId", e.target.value)}
                placeholder="yourname@email.com"
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact number</Label>
              <div className="flex">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  placeholder="345 567-23-56"
                  className="flex-1 ml-2"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dob">DOB</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="928a/123"
              />
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Madhapur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="madhapur">Madhapur</SelectItem>
                  <SelectItem value="hitech-city">Hitech City</SelectItem>
                  <SelectItem value="gachibowli">Gachibowli</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Hyderabad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Telangana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Professional Details */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Professional details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="selectBranch">Select Branch</Label>
                <Select
                  value={formData.selectBranch}
                  onValueChange={(value) => handleInputChange("selectBranch", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Madhapur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="madhapur">Madhapur</SelectItem>
                    <SelectItem value="hitech-city">Hitech City</SelectItem>
                    <SelectItem value="gachibowli">Gachibowli</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="selectCourse">Select course</Label>
                <Select
                  value={formData.selectCourse}
                  onValueChange={(value) => handleInputChange("selectCourse", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kick boxing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kick-boxing">Kick boxing</SelectItem>
                    <SelectItem value="taekwondo">Taekwondo</SelectItem>
                    <SelectItem value="karate">Karate</SelectItem>
                    <SelectItem value="kung-fu">Kung Fu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleInputChange("experienceLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Entry level/Intermediate expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="injuriesHealthNotes">Injuries/Health Notes</Label>
                <Select
                  value={formData.injuriesHealthNotes}
                  onValueChange={(value) => handleInputChange("injuriesHealthNotes", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Asthma, knee injury" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="asthma">Asthma</SelectItem>
                    <SelectItem value="knee-injury">Knee injury</SelectItem>
                    <SelectItem value="back-pain">Back pain</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label htmlFor="beltRank">Belt Rank (if any)</Label>
                <Select value={formData.beltRank} onValueChange={(value) => handleInputChange("beltRank", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="White/Yellow/Blue/Black/etc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="selectSlot">Select Slot</Label>
                <Select value={formData.selectSlot} onValueChange={(value) => handleInputChange("selectSlot", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Morning/Evening/Weekend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="weekend">Weekend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="joiningDate">Joining date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="mt-6">
              <Label>Payment Plan</Label>
              <RadioGroup
                value={formData.paymentPlan}
                onValueChange={(value) => handleInputChange("paymentPlan", value)}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Full Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emi" id="emi" />
                  <Label htmlFor="emi">EMI</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8">
            Save Changes
          </Button>
        </form>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Student Updated Successfully</h3>
            <p className="text-gray-600 mb-6">The student information has been updated successfully.</p>
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
      )}
    </div>
  )
}
