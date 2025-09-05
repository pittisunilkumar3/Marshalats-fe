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
import { Bell, Search, ChevronDown, MoreHorizontal, ArrowLeft, User, GraduationCap, MapPin, Phone, Mail, Calendar, Award, Briefcase, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function AddCoachPage() {
  const router = useRouter()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state - Updated to match API structure
  const [formData, setFormData] = useState({
    personal_info: {
      first_name: "",
      last_name: "",
      gender: "",
      date_of_birth: ""
    },
    contact_info: {
      email: "",
      country_code: "+91",
      phone: "",
      password: ""
    },
    address_info: {
      address: "",
      area: "",
      city: "",
      state: "",
      zip_code: "",
      country: ""
    },
    professional_info: {
      education_qualification: "",
      professional_experience: "",
      designation_id: "",
      certifications: [] as string[]
    },
    areas_of_expertise: [] as string[]
  })

  const [errors, setErrors] = useState<any>({})
  const [newCertification, setNewCertification] = useState("")

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value }
    }))
    // Clear error when user starts typing
    if (errors[`personal_info.${field}`]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors[`personal_info.${field}`]
        return newErrors
      })
    }
  }

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value }
    }))
    // Clear error when user starts typing
    if (errors[`contact_info.${field}`]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors[`contact_info.${field}`]
        return newErrors
      })
    }
  }

  const handleAddressInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address_info: { ...prev.address_info, [field]: value }
    }))
    // Clear error when user starts typing
    if (errors[`address_info.${field}`]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors[`address_info.${field}`]
        return newErrors
      })
    }
  }

  const handleProfessionalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      professional_info: { ...prev.professional_info, [field]: value }
    }))
    // Clear error when user starts typing
    if (errors[`professional_info.${field}`]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors[`professional_info.${field}`]
        return newErrors
      })
    }
  }

  const handleExpertiseChange = (expertise: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      areas_of_expertise: checked 
        ? [...prev.areas_of_expertise, expertise]
        : prev.areas_of_expertise.filter((item) => item !== expertise)
    }))
    // Clear error when user makes a selection
    if (errors.areas_of_expertise) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors.areas_of_expertise
        return newErrors
      })
    }
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        professional_info: {
          ...prev.professional_info,
          certifications: [...prev.professional_info.certifications, newCertification.trim()]
        }
      }))
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      professional_info: {
        ...prev.professional_info,
        certifications: prev.professional_info.certifications.filter((_, i) => i !== index)
      }
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}
    
    // Personal Info validation
    if (!formData.personal_info.first_name.trim()) {
      newErrors['personal_info.first_name'] = 'First name is required'
    }
    if (!formData.personal_info.last_name.trim()) {
      newErrors['personal_info.last_name'] = 'Last name is required'
    }
    if (!formData.personal_info.gender) {
      newErrors['personal_info.gender'] = 'Gender is required'
    }
    if (!formData.personal_info.date_of_birth) {
      newErrors['personal_info.date_of_birth'] = 'Date of birth is required'
    }

    // Contact Info validation
    if (!formData.contact_info.email.trim()) {
      newErrors['contact_info.email'] = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_info.email)) {
      newErrors['contact_info.email'] = 'Please enter a valid email address'
    }
    if (!formData.contact_info.phone.trim()) {
      newErrors['contact_info.phone'] = 'Phone number is required'
    }
    if (!formData.contact_info.password.trim()) {
      newErrors['contact_info.password'] = 'Password is required'
    } else if (formData.contact_info.password.length < 8) {
      newErrors['contact_info.password'] = 'Password must be at least 8 characters long'
    }

    // Address Info validation
    if (!formData.address_info.address.trim()) {
      newErrors['address_info.address'] = 'Address is required'
    }
    if (!formData.address_info.city.trim()) {
      newErrors['address_info.city'] = 'City is required'
    }
    if (!formData.address_info.state.trim()) {
      newErrors['address_info.state'] = 'State is required'
    }
    if (!formData.address_info.country.trim()) {
      newErrors['address_info.country'] = 'Country is required'
    }

    // Professional Info validation
    if (!formData.professional_info.education_qualification.trim()) {
      newErrors['professional_info.education_qualification'] = 'Education qualification is required'
    }
    if (!formData.professional_info.professional_experience) {
      newErrors['professional_info.professional_experience'] = 'Professional experience is required'
    }
    if (!formData.professional_info.designation_id) {
      newErrors['professional_info.designation_id'] = 'Designation is required'
    }

    // Areas of expertise validation
    if (formData.areas_of_expertise.length === 0) {
      newErrors.areas_of_expertise = 'At least one area of expertise is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("token")
      
      if (!token) {
        setErrors({ general: "Authentication token not found. Please login again." })
        setIsSubmitting(false)
        return
      }

      console.log("Submitting coach data:", formData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coaches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (!response.ok) {
        if (response.status === 400) {
          // Handle validation errors
          if (result.detail && Array.isArray(result.detail)) {
            const fieldErrors: any = {}
            result.detail.forEach((error: any) => {
              if (error.loc && error.loc.length > 1) {
                const fieldPath = error.loc.slice(1).join('.')
                fieldErrors[fieldPath] = error.msg
              }
            })
            setErrors(fieldErrors)
          } else {
            setErrors({ general: result.detail || "Validation error occurred" })
          }
        } else if (response.status === 409) {
          // Handle email already exists
          setErrors({ 'contact_info.email': result.detail || "Email already exists" })
        } else if (response.status === 401) {
          setErrors({ general: "Authentication failed. Please login again." })
        } else if (response.status === 403) {
          setErrors({ general: "You don't have permission to create coaches." })
        } else {
          setErrors({ general: result.detail || `Server error (${response.status})` })
        }
        setIsSubmitting(false)
        return
      }

      // Success
      console.log("Coach created successfully:", result)
      setShowSuccessPopup(true)
      
    } catch (err) {
      console.error("Error creating coach:", err)
      setErrors({ 
        general: "Network error occurred. Please check your connection and try again." 
      })
    } finally {
      setIsSubmitting(false)
    }
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
          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errors.general}</span>
              </div>
            </div>
          )}

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
                      value={formData.personal_info.first_name}
                      onChange={(e) => handlePersonalInfoChange("first_name", e.target.value)}
                      className={`h-11 w-full ${errors['personal_info.first_name'] ? 'border-red-500' : ''}`}
                    />
                    {errors['personal_info.first_name'] && (
                      <p className="text-red-500 text-xs">{errors['personal_info.first_name']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.personal_info.last_name}
                      onChange={(e) => handlePersonalInfoChange("last_name", e.target.value)}
                      className={`h-11 w-full ${errors['personal_info.last_name'] ? 'border-red-500' : ''}`}
                    />
                    {errors['personal_info.last_name'] && (
                      <p className="text-red-500 text-xs">{errors['personal_info.last_name']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.personal_info.gender} 
                      onValueChange={(value) => handlePersonalInfoChange("gender", value)}
                    >
                      <SelectTrigger className={`h-11 w-full ${errors['personal_info.gender'] ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors['personal_info.gender'] && (
                      <p className="text-red-500 text-xs">{errors['personal_info.gender']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        value={formData.personal_info.date_of_birth}
                        onChange={(e) => handlePersonalInfoChange("date_of_birth", e.target.value)}
                        className={`h-11 pl-10 w-full ${errors['personal_info.date_of_birth'] ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors['personal_info.date_of_birth'] && (
                      <p className="text-red-500 text-xs">{errors['personal_info.date_of_birth']}</p>
                    )}
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
                        value={formData.contact_info.email}
                        onChange={(e) => handleContactInfoChange("email", e.target.value)}
                        className={`h-11 pl-10 w-full ${errors['contact_info.email'] ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors['contact_info.email'] && (
                      <p className="text-red-500 text-xs">{errors['contact_info.email']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      placeholder="Enter phone number"
                      value={formData.contact_info.phone}
                      onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                      className={`h-11 w-full ${errors['contact_info.phone'] ? 'border-red-500' : ''}`}
                    />
                    {errors['contact_info.phone'] && (
                      <p className="text-red-500 text-xs">{errors['contact_info.phone']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="countryCode" className="text-sm font-medium">
                      Country Code <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.contact_info.country_code}
                      onValueChange={(value) => handleContactInfoChange("country_code", value)}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1 (USA)</SelectItem>
                        <SelectItem value="+91">+91 (India)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                        <SelectItem value="+61">+61 (Australia)</SelectItem>
                        <SelectItem value="+86">+86 (China)</SelectItem>
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
                      value={formData.contact_info.password}
                      onChange={(e) => handleContactInfoChange("password", e.target.value)}
                      className={`h-11 w-full ${errors['contact_info.password'] ? 'border-red-500' : ''}`}
                    />
                    {errors['contact_info.password'] && (
                      <p className="text-red-500 text-xs">{errors['contact_info.password']}</p>
                    )}
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
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={formData.address_info.address}
                      onChange={(e) => handleAddressInfoChange("address", e.target.value)}
                      className={`h-11 w-full ${errors['address_info.address'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address_info.address'] && (
                      <p className="text-red-500 text-xs">{errors['address_info.address']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-medium">Area</Label>
                    <Input
                      id="area"
                      placeholder="Enter area/locality"
                      value={formData.address_info.area}
                      onChange={(e) => handleAddressInfoChange("area", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.address_info.city}
                      onChange={(e) => handleAddressInfoChange("city", e.target.value)}
                      className={`h-11 w-full ${errors['address_info.city'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address_info.city'] && (
                      <p className="text-red-500 text-xs">{errors['address_info.city']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={formData.address_info.state}
                      onChange={(e) => handleAddressInfoChange("state", e.target.value)}
                      className={`h-11 w-full ${errors['address_info.state'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address_info.state'] && (
                      <p className="text-red-500 text-xs">{errors['address_info.state']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium">Zip Code/Pin Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter zip/pin code"
                      value={formData.address_info.zip_code}
                      onChange={(e) => handleAddressInfoChange("zip_code", e.target.value)}
                      className="h-11 w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={formData.address_info.country}
                      onChange={(e) => handleAddressInfoChange("country", e.target.value)}
                      className={`h-11 w-full ${errors['address_info.country'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address_info.country'] && (
                      <p className="text-red-500 text-xs">{errors['address_info.country']}</p>
                    )}
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
                        value={formData.professional_info.education_qualification}
                        onChange={(e) => handleProfessionalInfoChange("education_qualification", e.target.value)}
                        className={`h-11 pl-10 w-full ${errors['professional_info.education_qualification'] ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors['professional_info.education_qualification'] && (
                      <p className="text-red-500 text-xs">{errors['professional_info.education_qualification']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="professionalExperience" className="text-sm font-medium">
                      Professional Experience <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.professional_info.professional_experience}
                      onValueChange={(value) => handleProfessionalInfoChange("professional_experience", value)}
                    >
                      <SelectTrigger className={`h-11 w-full ${errors['professional_info.professional_experience'] ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-4 years">3-4 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors['professional_info.professional_experience'] && (
                      <p className="text-red-500 text-xs">{errors['professional_info.professional_experience']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-sm font-medium">
                      Designation <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Select
                        value={formData.professional_info.designation_id}
                        onValueChange={(value) => handleProfessionalInfoChange("designation_id", value)}
                      >
                        <SelectTrigger className={`h-11 pl-10 w-full ${errors['professional_info.designation_id'] ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="designation-uuid-instructor">Instructor</SelectItem>
                          <SelectItem value="designation-uuid-master">Master</SelectItem>
                          <SelectItem value="designation-uuid-sr-master">Sr Master</SelectItem>
                          <SelectItem value="designation-uuid-grandmaster">Grandmaster</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors['professional_info.designation_id'] && (
                      <p className="text-red-500 text-xs">{errors['professional_info.designation_id']}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certification" className="text-sm font-medium">
                      Add Certifications
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="certification"
                        placeholder="Enter certification"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        className="h-11 flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                      />
                      <Button 
                        type="button" 
                        onClick={addCertification}
                        className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add
                      </Button>
                    </div>
                    {formData.professional_info.certifications.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Added Certifications:</Label>
                        <div className="flex flex-wrap gap-2">
                          {formData.professional_info.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                              {cert}
                              <button
                                type="button"
                                onClick={() => removeCertification(index)}
                                className="text-gray-500 hover:text-red-500 ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
                          checked={formData.areas_of_expertise.includes(expertise)}
                          onCheckedChange={(checked) => handleExpertiseChange(expertise, checked as boolean)}
                          className="w-5 h-5"
                        />
                        <Label htmlFor={expertise} className="text-sm font-medium cursor-pointer flex-1">
                          {expertise}
                        </Label>
                      </div>
                    ),
                  )}
                </div>

                {/* Validation Error for Areas of Expertise */}
                {errors.areas_of_expertise && (
                  <p className="text-red-500 text-xs">{errors.areas_of_expertise}</p>
                )}

                {/* Selected Expertise Display */}
                {formData.areas_of_expertise.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700">Selected Expertise:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.areas_of_expertise.map((expertise: string) => (
                        <Badge key={expertise} variant="secondary" className="px-3 py-1">
                          {expertise}
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
                  <p className="text-xs text-gray-500 mt-2">
                    API: {process.env.NEXT_PUBLIC_BACKEND_URL}/coaches
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
