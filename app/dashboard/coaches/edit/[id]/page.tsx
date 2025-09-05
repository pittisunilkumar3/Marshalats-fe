"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Search, ChevronDown, MoreHorizontal, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter, useParams } from "next/navigation"

export default function EditCoachPage() {
  const router = useRouter()
  const params = useParams()
  const coachId = Number.parseInt(params.id as string)

  // Sample coaches data (in a real app, this would come from a database)
  const coachesData = [
    {
      id: 1,
      firstName: "Ravi",
      lastName: "Chandran",
      gender: "Male",
      age: "32",
      email: "ravi@email.com",
      contactNumber: "345 567-23-56",
      address: "928a123",
      area: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500089",
      country: "India",
      education: "Bachelor Degree",
      experience: "5+ years",
      expertise: ["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts"],
      designation: "Sr Master",
    },
    {
      id: 2,
      firstName: "Sneha",
      lastName: "Sharma",
      gender: "Female",
      age: "28",
      email: "sneha@email.com",
      contactNumber: "345 567-23-56",
      address: "928a123",
      area: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500089",
      country: "India",
      education: "Bachelor Degree",
      experience: "5+ years",
      expertise: ["Taekwondo", "Bharath Natyam", "Zumba Dance"],
      designation: "Grandmaster",
    },
  ]

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    email: "",
    contactNumber: "",
    address: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    education: "",
    experience: "",
    expertise: [] as string[],
    designation: "",
  })

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  useEffect(() => {
    const coach = coachesData.find((c) => c.id === coachId + 1) // +1 because array index vs ID
    if (coach) {
      setFormData({
        firstName: coach.firstName,
        lastName: coach.lastName,
        gender: coach.gender,
        age: coach.age,
        email: coach.email,
        contactNumber: coach.contactNumber,
        address: coach.address,
        area: coach.area,
        city: coach.city,
        state: coach.state,
        zipCode: coach.zipCode,
        country: coach.country,
        education: coach.education,
        experience: coach.experience,
        expertise: coach.expertise,
        designation: coach.designation,
      })
    }
  }, [coachId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExpertiseChange = (skill: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      expertise: checked ? [...prev.expertise, skill] : prev.expertise.filter((s) => s !== skill),
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

  const martialArts = ["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"]

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Coach</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/coaches")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to coach List</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Ravi krishna"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="R"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Male" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                {/* Email ID */}
                <div>
                  <Label htmlFor="email">Email ID</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="yourname@email.com"
                  />
                </div>

                {/* Contact number */}
                <div>
                  <Label htmlFor="contactNumber">Contact number</Label>
                  <div className="flex">
                    <Select defaultValue="+1">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+91">+91</SelectItem>
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

                {/* Address */}
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="928a123"
                  />
                </div>

                {/* Area */}
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="Madhapur"
                  />
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Hyderabad"
                  />
                </div>

                {/* State */}
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Telangana"
                  />
                </div>

                {/* Zip Code/Pin Code */}
                <div>
                  <Label htmlFor="zipCode">Zip Code/Pin Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="500089"
                  />
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="India"
                  />
                </div>

                {/* Education Qualification */}
                <div>
                  <Label htmlFor="education">Education Qualification</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="Bachelor Degree"
                  />
                </div>

                {/* Professional Experience */}
                <div>
                  <Label htmlFor="experience">Professional Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="5+ years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-4 years">3-4 years</SelectItem>
                      <SelectItem value="5+ years">5+ years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Expert in */}
                <div className="md:col-span-2">
                  <Label>Expert in</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {martialArts.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.expertise.includes(skill)}
                          onCheckedChange={(checked) => handleExpertiseChange(skill, checked as boolean)}
                        />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Designation */}
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
                      <SelectItem value="Sr Master">Sr Master</SelectItem>
                      <SelectItem value="Grandmaster">Grandmaster</SelectItem>
                      <SelectItem value="Sensei">Sensei</SelectItem>
                      <SelectItem value="Dojo-cho">Dojo-cho</SelectItem>
                      <SelectItem value="Shihan">Shihan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8">
                <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  Save Changes
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Coach Updated Successfully!</h3>
              <p className="text-gray-600 mb-6">The coach information has been updated successfully.</p>
              <div className="flex space-x-3">
                <Button onClick={handleSuccessOk} className="bg-yellow-400 hover:bg-yellow-500 text-black flex-1">
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
