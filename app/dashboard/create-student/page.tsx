"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"

export default function CreateStudent() {
  const router = useRouter()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    countryCode: "+91",
    gender: "",
    dob: "",
    address: "",
    area: "",
    city: "",
    state: "",
    branch: "",
    course: "",
    experienceLevel: "",
    healthNotes: "",
    beltRank: "",
    slot: "",
    joiningDate: "",
    paymentPlan: "full",
  })

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
      <DashboardHeader currentPage="Create Student" />

      {/* Main Content */}
      <main className="w-full p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create student</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/students")}
            className="flex items-center space-x-2"
          >
            <span>Add New Student</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Uday Kumar"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Ch"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="yourname@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact number</Label>
              <div className="flex">
                <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
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
                  placeholder="345 567-23-56"
                  className="flex-1 ml-2"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="928a/123" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">DOB</Label>
              <Input
                id="dob"
                placeholder="Choose"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="928a/123"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
          <div className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="branch">Select Branch</Label>
                <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
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
              <div className="space-y-2">
                <Label htmlFor="course">Select course</Label>
                <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kick boxing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kick-boxing">Kick Boxing</SelectItem>
                    <SelectItem value="taekwondo">Taekwondo</SelectItem>
                    <SelectItem value="karate">Karate</SelectItem>
                    <SelectItem value="kung-fu">Kung Fu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleInputChange("experienceLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Entry level/Intermediate expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="health">Injuries/Health Notes</Label>
                <Select value={formData.healthNotes} onValueChange={(value) => handleInputChange("healthNotes", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asthma, knee injury" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="asthma">Asthma</SelectItem>
                    <SelectItem value="knee-injury">Knee Injury</SelectItem>
                    <SelectItem value="back-pain">Back Pain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="belt">Belt Rank (if any)</Label>
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
              <div className="space-y-2">
                <Label htmlFor="slot">Select Slot</Label>
                <Select value={formData.slot} onValueChange={(value) => handleInputChange("slot", value)}>
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
              <div className="space-y-2">
                <Label htmlFor="joining">Joining date</Label>
                <Input
                  id="joining"
                  placeholder="DD/MM/YY"
                  className="max-w-xs"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                />
              </div>
            </div>

            {/* Payment Plan */}
            <div className="mt-6">
              <Label className="text-base font-medium">Payment Plan</Label>
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

          <div className="pt-6">
            <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Save & Register
            </Button>
          </div>
        </form>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Student Created Successfully!</h3>
            <p className="text-gray-600 mb-6">The student has been added to the system successfully.</p>
            <div className="flex space-x-3">
              <Button onClick={handleSuccessOk} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                OK
              </Button>
              <Button onClick={handleSuccessOk} variant="outline">
                Back to List
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
