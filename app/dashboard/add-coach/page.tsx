"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, ChevronDown, MoreHorizontal, ArrowLeft, User, GraduationCap, MapPin, Phone, Mail, Calendar, Award, Briefcase } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function AddCoachPage() {
  const router = useRouter()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    emailId: "",
    contactNumber: "",
    countryCode: "+1",
    password: "",
    address: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    educationQualification: "",
    professionalExperience: "",
    expertIn: [] as string[],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Coach</h1>
            <p className="text-gray-600 mt-1">Add a new martial arts coach to your academy</p>
          </div>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 self-start sm:self-center"
            onClick={() => router.push("/dashboard/coaches")}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to coach List</span>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Personal Information & Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="age"
                        placeholder="DD/MM/YYYY"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="h-11 pl-10 w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailId" className="text-sm font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="emailId"
                        type="email"
                        placeholder="coach@example.com"
                        value={formData.emailId}
                        onChange={(e) => handleInputChange("emailId", e.target.value)}
                        className="h-11 pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-sm font-medium">
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter phone number"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryCode" className="text-sm font-medium">
                      Country Code <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => handleInputChange("countryCode", value)}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1 (USA)</SelectItem>
                        <SelectItem value="+91">+91 (India)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Address Information & Professional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Address Information Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-medium">Area</Label>
                    <Input
                      id="area"
                      placeholder="Enter area/locality"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">State</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium">Zip Code/Pin Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter zip/pin code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="educationQualification" className="text-sm font-medium">
                      Education Qualification <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="educationQualification"
                        placeholder="e.g., Bachelor's Degree"
                        value={formData.educationQualification}
                        onChange={(e) => handleInputChange("educationQualification", e.target.value)}
                        className="h-11 pl-10 w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalExperience" className="text-sm font-medium">
                      Professional Experience <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.professionalExperience}
                      onValueChange={(value) => handleInputChange("professionalExperience", value)}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2-years">1-2 years</SelectItem>
                        <SelectItem value="3-4-years">3-4 years</SelectItem>
                        <SelectItem value="5+-years">5+ years</SelectItem>
                        <SelectItem value="10+-years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-sm font-medium">
                      Designation <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Select
                        value={formData.designation}
                        onValueChange={(value) => handleInputChange("designation", value)}
                      >
                        <SelectTrigger className="h-11 pl-10 w-full">
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="sr-master">Sr Master</SelectItem>
                          <SelectItem value="grandmaster">Grandmaster</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certification" className="text-sm font-medium">
                      Certifications
                    </Label>
                    <Input
                      id="certification"
                      placeholder="Enter certifications"
                      className="h-11 w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Expertise Section - Full Width */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="w-5 h-5 text-yellow-600" />
                Areas of Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Select Martial Arts Disciplines <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-600">Choose all the martial arts disciplines this coach specializes in</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"].map(
                    (expertise) => (
                      <div key={expertise} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={expertise}
                          checked={formData.expertIn.includes(expertise.toLowerCase().replace(/\s+/g, "-"))}
                          onCheckedChange={(checked) =>
                            handleExpertiseChange(expertise.toLowerCase().replace(/\s+/g, "-"), checked as boolean)
                          }
                          className="w-5 h-5"
                        />
                        <Label htmlFor={expertise} className="text-sm font-medium cursor-pointer flex-1">
                          {expertise}
                        </Label>
                      </div>
                    ),
                  )}
                </div>

                {/* Selected Expertise Display */}
                {formData.expertIn.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700">Selected Expertise:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.expertIn.map((expertise) => (
                        <Badge key={expertise} variant="secondary" className="px-3 py-1">
                          {expertise.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="shadow-sm border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Create Coach?</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Please review all the information before submitting
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-8 py-3 h-auto font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Coach...
                    </>
                  ) : (
                    "Create Coach"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Coach Created Successfully!</h3>
              <p className="text-gray-600 mb-8">
                The coach profile has been created and added to your academy system. They can now be assigned to classes and students.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSuccessOk} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black flex-1 h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Continue
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/dashboard/coaches")} 
                  className="flex-1 h-12 border-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  View All Coaches
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
