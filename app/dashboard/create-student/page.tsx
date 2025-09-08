"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPinIcon, Building2Icon, FolderIcon, BookOpenIcon, ClockIcon, UserIcon, MailIcon, PhoneIcon, Users2Icon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { branchAPI } from "@/lib/branchAPI"
import { courseAPI } from "@/lib/courseAPI"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/dashboard-header"

interface Branch {
  id: string
  name: string
  code?: string
  address?: string
  phone?: string
  email?: string
  location?: string
  location_id?: string
}

interface Course {
  id: string
  title: string
  code: string
  description: string
  difficulty_level: string
  category_id: string
  category_name?: string
  duration?: string
  pricing: {
    amount: number
    currency: string
  }
}

interface FormErrors {
  [key: string]: string
}

export default function CreateStudent() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  // API Loading states
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)
  const [isLoadingBranches, setIsLoadingBranches] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Form state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [joiningDate, setJoiningDate] = useState<Date>()
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    countryCode: "+91",
    gender: "",
    dob: "",
    password: "",
    biometricId: "",
    
    // Address Information
    address: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    
    // Professional Details
    location: "",
    branch: "",
    category: "",
    course: "",
    duration: "",
    experienceLevel: "",
    healthNotes: "",
    beltRank: "",
    slot: "",
    joiningDate: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    
    // Payment Plan
    paymentPlan: "full",
  })

  // Dynamic locations will be loaded from API

  // Dynamic branches will be loaded from API

  // Dynamic courses and categories will be loaded from API

  // Duration options
  const durations = [
    { id: "1-month", name: "1 Month" },
    { id: "3-months", name: "3 Months" },
    { id: "6-months", name: "6 Months" },
    { id: "12-months", name: "12 Months" },
    { id: "lifetime", name: "Lifetime" }
  ]

  // Experience levels
  const experienceLevels = [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
    { id: "expert", name: "Expert" }
  ]

  // Belt ranks
  const beltRanks = [
    { id: "none", name: "None" },
    { id: "white", name: "White Belt" },
    { id: "yellow", name: "Yellow Belt" },
    { id: "orange", name: "Orange Belt" },
    { id: "green", name: "Green Belt" },
    { id: "blue", name: "Blue Belt" },
    { id: "brown", name: "Brown Belt" },
    { id: "black", name: "Black Belt" }
  ]

  // Time slots
  const timeSlots = [
    { id: "morning-6-8", name: "Morning (6:00 AM - 8:00 AM)" },
    { id: "morning-8-10", name: "Morning (8:00 AM - 10:00 AM)" },
    { id: "evening-4-6", name: "Evening (4:00 PM - 6:00 PM)" },
    { id: "evening-6-8", name: "Evening (6:00 PM - 8:00 PM)" },
    { id: "evening-8-10", name: "Evening (8:00 PM - 10:00 PM)" },
    { id: "weekend-morning", name: "Weekend Morning" },
    { id: "weekend-evening", name: "Weekend Evening" }
  ]

  // Load locations, branches and courses on component mount
  useEffect(() => {
    const loadData = async () => {
      // Using public APIs - no authentication required

      try {
        // Load locations
        setIsLoadingLocations(true)
        const locationsResponse = await fetch('http://82.29.165.77:8003/locations/public/details?active_only=true')
        if (locationsResponse.ok) {
          const locationsData = await locationsResponse.json()
          setLocations(locationsData.locations || [])
        }
      } catch (error) {
        console.error('Error loading locations:', error)
        toast({
          title: "Error",
          description: "Failed to load locations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingLocations(false)
      }

      try {
        // Load branches
        setIsLoadingBranches(true)
        const branchesResponse = await fetch('http://82.29.165.77:8003/locations/public/with-branches?active_only=true')
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json()

          // Extract branches from locations
          const allBranches: any[] = []
          if (branchesData.locations) {
            branchesData.locations.forEach((location: any) => {
              if (location.branches) {
                allBranches.push(...location.branches)
              }
            })
          }
          setBranches(allBranches)
        }
      } catch (error) {
        console.error('Error loading branches:', error)
        toast({
          title: "Error",
          description: "Failed to load branches. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingBranches(false)
      }

      try {
        // Load courses
        setIsLoadingCourses(true)
        const coursesResponse = await fetch('http://82.29.165.77:8003/courses/public/all')
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          const allCourses = coursesData.courses || []
          setCourses(allCourses)
          setFilteredCourses(allCourses)
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCourses(false)
      }

      try {
        // Load categories
        setIsLoadingCategories(true)
        const categoriesResponse = await fetch('http://82.29.165.77:8003/categories/public/details?active_only=true')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadData()
  }, []) // Using public APIs - no dependencies needed

  // Use dynamic data loaded from APIs

  // Filter courses based on selected category
  useEffect(() => {
    if (formData.category) {
      const filtered = courses.filter(course =>
        course.category_id === formData.category ||
        course.category_name?.toLowerCase().includes(formData.category.toLowerCase())
      )
      setFilteredCourses(filtered)
    } else {
      setFilteredCourses(courses)
    }
  }, [formData.category, courses])

  const filteredBranches = useMemo(() => {
    if (!formData.location) {
      return branches
    }

    // Find the selected location
    const selectedLocation = locations.find(loc => loc.id === formData.location)

    if (!selectedLocation) {
      return branches
    }

    // Filter branches by matching city with location name or state
    const filtered = branches.filter(branch => {
      const cityMatch = branch.address?.city?.toLowerCase() === selectedLocation.name.toLowerCase()
      const stateMatch = branch.address?.state?.toLowerCase() === selectedLocation.state?.toLowerCase()
      return cityMatch || stateMatch
    })

    return filtered
  }, [formData.location, branches, locations])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      handleInputChange(field, formattedDate)
      
      if (field === "dob") {
        setSelectedDate(date)
      } else if (field === "joiningDate") {
        setJoiningDate(date)
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields validation - only for fields in the design
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.dob) newErrors.dob = "Date of birth is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (!formData.location) newErrors.location = "Location is required"
    if (!formData.branch) newErrors.branch = "Branch is required"
    if (!formData.course) newErrors.course = "Course is required"

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    // Phone number validation
    if (formData.contactNumber && !/^[0-9]{10}$/.test(formData.contactNumber.replace(/\s+/g, ''))) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create API payload according to backend User Management API specification
      const apiPayload = {
        email: formData.email,
        phone: `${formData.countryCode}${formData.contactNumber}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: "student",
        password: formData.password || "TempPassword123!",
        date_of_birth: formData.dob || undefined,
        gender: formData.gender || undefined,
        biometric_id: formData.biometricId || undefined,
        course: formData.course ? {
          category_id: formData.category,
          course_id: formData.course,
          duration: formData.duration || "3-months"
        } : undefined,
        branch: formData.branch ? {
          location_id: formData.location,
          branch_id: formData.branch
        } : undefined
      }

      console.log("Creating student with data:", apiPayload)

      // Make API call using public registration endpoint (no auth required)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPayload),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Student created successfully:', result)
        setShowSuccessPopup(true)
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.message || 'Failed to create student. Please try again.' })
        console.error('Student creation failed:', errorData)
      }
    } catch (error) {
      console.error('Error creating student:', error)
      setErrors({ submit: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/students")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Create Student" />

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create New Student</h1>
            <p className="text-gray-600 text-sm sm:text-base">Add a new student to your martial arts academy</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/students")}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <span>← Back to Students</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form data...</p>
          </div>
        )}

        {/* Main Form Card */}
        {!isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Form Header */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 sm:px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Student Information</h2>
              <p className="text-gray-600 text-sm">Please fill in all required fields marked with *</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              {/* Error Display */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Form Fields Grid */}
              <div className="space-y-8">
                
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* First Name */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={cn(
                            "pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl h-14",
                            errors.firstName ? "border-red-500 bg-red-50" : ""
                          )}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={cn(
                            "pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl h-14",
                            errors.lastName ? "border-red-500 bg-red-50" : ""
                          )}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <MailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={cn(
                            "pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl h-14",
                            errors.email ? "border-red-500 bg-red-50" : ""
                          )}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Enter mobile number"
                          value={formData.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                          className={cn(
                            "pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl h-14",
                            errors.contactNumber ? "border-red-500 bg-red-50" : ""
                          )}
                        />
                        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                          <SelectTrigger className={cn(
                            "!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14",
                            errors.gender ? "!border-red-500 !bg-red-50" : ""
                          )}>
                            <SelectValue placeholder="Select Gender" className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                            <SelectItem value="male" className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Male</SelectItem>
                            <SelectItem value="female" className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Female</SelectItem>
                            <SelectItem value="other" className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-14 justify-start text-left font-normal pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl",
                                !selectedDate && "text-gray-500",
                                selectedDate && "text-gray-900",
                                errors.dob ? "border-red-500 bg-red-50" : ""
                              )}
                            >
                              <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date of birth"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-xl shadow-lg">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => handleDateChange("dob", date)}
                              initialFocus
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              className="rounded-xl"
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={cn(
                            "pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl h-14",
                            errors.password ? "border-red-500 bg-red-50" : ""
                          )}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>
                    </div>

                    {/* Biometric ID */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Biometric ID
                      </Label>
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-3 8V9a3 3 0 00-6 0v3m6 0a3 3 0 11-6 0" />
                        </svg>
                        <Input
                          type="text"
                          placeholder="Enter biometric ID (optional)"
                          value={formData.biometricId}
                          onChange={(e) => handleInputChange("biometricId", e.target.value)}
                          className="pl-12 py-4 text-base bg-gray-50 border-gray-200 rounded-xl h-14"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Course Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Category */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Category</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                          <FolderIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                          disabled={isLoadingCategories}
                        >
                          <SelectTrigger className="!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14">
                            <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select Category"} className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem key={category.id} value={category.id} className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">No categories available</p>
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Course */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Course <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                          <BookOpenIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <Select
                          value={formData.course}
                          onValueChange={(value) => handleInputChange("course", value)}
                          disabled={isLoadingCourses}
                        >
                          <SelectTrigger className={cn(
                            "!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14",
                            errors.course ? "!border-red-500 !bg-red-50" : ""
                          )}>
                            <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Choose Course"} className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                            {filteredCourses.length > 0 ? (
                              filteredCourses.map((course) => (
                                <SelectItem key={course.id} value={course.id} className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{course.title}</span>
                                    <span className="text-xs text-gray-500">
                                      {course.code} • {course.difficulty_level} • {course.pricing?.currency} {course.pricing?.amount}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">No courses available</p>
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Duration</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                          <ClockIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                          <SelectTrigger className="!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14">
                            <SelectValue placeholder="Select Duration" className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                            {durations.map((duration) => (
                              <SelectItem key={duration.id} value={duration.id} className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">
                                {duration.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Location */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                          <MapPinIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <Select
                          value={formData.location}
                          onValueChange={(value) => handleInputChange("location", value)}
                          disabled={isLoadingLocations}
                        >
                          <SelectTrigger className={cn(
                            "!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14",
                            errors.location ? "!border-red-500 !bg-red-50" : ""
                          )}>
                            <SelectValue placeholder={isLoadingLocations ? "Loading locations..." : "Select Location"} className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                            {locations.length > 0 ? (
                              locations.map((location) => (
                                <SelectItem key={location.id} value={location.id} className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">
                                  {location.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">No locations available</p>
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                      </div>
                    </div>

                    {/* Branch */}
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                          <Building2Icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <Select
                          value={formData.branch}
                          onValueChange={(value) => handleInputChange("branch", value)}
                          disabled={!formData.location || isLoadingBranches}
                        >
                          <SelectTrigger className={cn(
                            "!w-full !h-14 !pl-12 !pr-4 !py-4 !text-base !bg-gray-50 !border-gray-200 !rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent !min-h-14",
                            errors.branch ? "!border-red-500 !bg-red-50" : "",
                            (!formData.location || isLoadingBranches) ? "opacity-50 cursor-not-allowed !bg-gray-200" : ""
                          )}>
                            <SelectValue placeholder={
                              isLoadingBranches
                                ? "Loading branches..."
                                : !formData.location
                                  ? "Select location first"
                                  : "Select Branch"
                            } className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-lg max-h-60">
                            {filteredBranches.length > 0 ? (
                              filteredBranches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id} className="!py-3 !pl-3 pr-8 text-base hover:bg-gray-50 rounded-lg cursor-pointer">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{branch.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {branch.address?.city}, {branch.address?.state}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="text-sm">No branches available</p>
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                        Creating Student...
                      </div>
                    ) : (
                      "Save & Register Student"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.push("/dashboard/students")}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl text-base font-medium border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-in slide-in-from-bottom-5">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Created Successfully!</h3>
              <p className="text-gray-600 mb-8 text-lg">The student has been added to the system successfully.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleSuccessOk} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-200"
                >
                  View Students
                </Button>
                <Button 
                  onClick={handleSuccessOk} 
                  variant="outline"
                  className="px-8 py-3 rounded-xl font-semibold border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Create Another
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
