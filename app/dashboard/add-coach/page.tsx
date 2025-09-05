"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Search, ChevronDown, MoreHorizontal, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function AddCoachPage() {
  const router = useRouter()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    emailId: "",
    contactNumber: "",
    countryCode: "+1",
    address: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    educationQualification: "",
    professionalExperience: "",
    expertIn: [],
    designation: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExpertiseChange = (expertise: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      expertIn: checked ? [...prev.expertIn, expertise] : prev.expertIn.filter((item) => item !== expertise),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccessPopup(true)
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/coaches")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as other admin pages */}
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
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Coach</h1>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600"
            onClick={() => router.push("/dashboard/coaches")}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to coach List</span>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Ravi krishna"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Male" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="emailId">Email ID</Label>
                    <Input
                      id="emailId"
                      type="email"
                      placeholder="yourname@email.com"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange("emailId", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="926a/123"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Hyderabad"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">Zip Code/Pin Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="500089"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="educationQualification">Education Qualification</Label>
                    <Input
                      id="educationQualification"
                      placeholder="Bachelor Degree"
                      value={formData.educationQualification}
                      onChange={(e) => handleInputChange("educationQualification", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expertIn">Expert in</Label>
                    <Select
                      value={formData.expertIn[0] || ""}
                      onValueChange={(value) => handleExpertiseChange(value, true)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Taekwondo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taekwondo">Taekwondo</SelectItem>
                        <SelectItem value="karate">Karate</SelectItem>
                        <SelectItem value="kungfu">Kung Fu</SelectItem>
                        <SelectItem value="mixed-martial-arts">Mixed Martial Arts</SelectItem>
                        <SelectItem value="zumba-dance">Zumba Dance</SelectItem>
                        <SelectItem value="bharath-natyam">Bharath Natyam</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Expertise Checkboxes */}
                    <div className="mt-4 space-y-2 max-h-32 overflow-y-auto border rounded p-3">
                      {["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"].map(
                        (expertise) => (
                          <div key={expertise} className="flex items-center space-x-2">
                            <Checkbox
                              id={expertise}
                              checked={formData.expertIn.includes(expertise.toLowerCase().replace(/\s+/g, "-"))}
                              onCheckedChange={(checked) =>
                                handleExpertiseChange(expertise.toLowerCase().replace(/\s+/g, "-"), checked as boolean)
                              }
                            />
                            <Label htmlFor={expertise} className="text-sm">
                              {expertise}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="R"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      placeholder="DD/MM/YYYY"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactNumber">Contact number</Label>
                    <div className="flex space-x-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) => handleInputChange("countryCode", value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+91">+91</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="345 567-23-56"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      placeholder="Madhapur"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Telangana"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="India"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="professionalExperience">Professional Experience</Label>
                    <Select
                      value={formData.professionalExperience}
                      onValueChange={(value) => handleInputChange("professionalExperience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="5+ years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2-years">1-2 years</SelectItem>
                        <SelectItem value="3-4-years">3-4 years</SelectItem>
                        <SelectItem value="5+-years">5+ years</SelectItem>
                        <SelectItem value="10+-years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Select
                      value={formData.designation}
                      onValueChange={(value) => handleInputChange("designation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sr Master" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="sr-master">Sr Master</SelectItem>
                        <SelectItem value="grandmaster">Grandmaster</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black px-8">
                  Create Coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coach Created Successfully!</h3>
              <p className="text-gray-600 mb-6">The coach has been added to the system successfully.</p>
              <div className="flex space-x-3">
                <Button onClick={handleSuccessOk} className="bg-yellow-400 hover:bg-yellow-500 text-black flex-1">
                  OK
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/coaches")} className="flex-1">
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
