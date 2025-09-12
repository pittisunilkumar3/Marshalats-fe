"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building, MapPin, Clock, Users, CreditCard, X } from "lucide-react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"
import { useToast } from "@/hooks/use-toast"

// Interfaces for form data
interface Course {
  id: string
  title: string
  code: string
  description: string
  difficulty_level: string
  category_id: string
  pricing: {
    currency: string
    amount: number
  }
  student_requirements: {
    max_students: number
    min_age: number
    max_age: number
    prerequisites: string[]
  }
  offers_certification: boolean
  media_resources: {
    course_image_url: string
    promo_video_url: string
  }
  created_at: string
}

interface Address {
  line1: string
  area: string
  city: string
  state: string
  pincode: string
  country: string
}

interface BranchInfo {
  name: string
  code: string
  email: string
  phone: string
  address: Address
}

interface Timing {
  day: string
  open: string
  close: string
}

interface OperationalDetails {
  courses_offered: string[]
  timings: Timing[]
  holidays: string[]
}

interface Assignments {
  accessories_available: boolean
  courses: string[]
  branch_admins: string[]
}

interface BankDetails {
  bank_name: string
  account_number: string
  upi_id: string
}

interface FormData {
  branch: BranchInfo
  manager_id: string
  operational_details: OperationalDetails
  assignments: Assignments
  bank_details: BankDetails
}

export default function CreateBranchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // API data state
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [coaches, setCoaches] = useState<{ id: string; name: string }[]>([])
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true)

  // State for new timing form
  const [newTiming, setNewTiming] = useState({
    day: "",
    open: "07:00",
    close: "19:00"
  })

  const [formData, setFormData] = useState<FormData>({
    branch: {
      name: "",
      code: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
      }
    },
    manager_id: "",
    operational_details: {
      courses_offered: [],
      timings: [],
      holidays: []
    },
    assignments: {
      accessories_available: false,
      courses: [],
      branch_admins: []
    },
    bank_details: {
      bank_name: "",
      account_number: "",
      upi_id: ""
    }
  })

  // Load data from APIs
  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setIsLoadingCoaches(true)

        // Get authentication token
        let token = TokenManager.getToken()

        // If no token, try to get one using superadmin credentials for testing
        if (!token) {
          console.log('No token found, attempting to get superadmin token...')
          try {
            const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/superadmin/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: "pittisunilkumar3@gmail.com",
                password: "StrongPassword@123"
              })
            })

            if (loginResponse.ok) {
              const loginData = await loginResponse.json()
              token = loginData.data.token
              console.log('✅ Got superadmin token for testing')

              // Store the token for future use
              if (token) {
                TokenManager.storeAuthData({
                  access_token: token,
                  token_type: 'bearer',
                  expires_in: loginData.data.expires_in,
                  admin: {
                    id: loginData.data.id,
                    full_name: loginData.data.full_name,
                    email: loginData.data.email,
                    role: 'superadmin'
                  }
                })
              }
            } else {
              console.error('Failed to get superadmin token')
              toast({
                title: "Authentication Error",
                description: "Unable to authenticate. Please login manually.",
                variant: "destructive",
              })
              setIsLoadingCoaches(false)
              return
            }
          } catch (error) {
            console.error('Error getting superadmin token:', error)
            toast({
              title: "Authentication Error",
              description: "Please login to access coach data.",
              variant: "destructive",
            })
            setIsLoadingCoaches(false)
            return
          }
        }

        // Call real backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches?active_only=true&limit=100`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Real backend coaches data:', data)

          // Transform coach data to the format needed for dropdowns
          const coachOptions = (data.coaches || []).map((coach: any) => ({
            id: coach.id,
            name: coach.full_name || `${coach.personal_info?.first_name || ''} ${coach.personal_info?.last_name || ''}`.trim() || `${coach.first_name || ''} ${coach.last_name || ''}`.trim()
          }))

          console.log('✅ Transformed coach options:', coachOptions)
          setCoaches(coachOptions)
        } else {
          console.error('Failed to load coaches:', response.status, response.statusText)
          if (response.status === 401) {
            toast({
              title: "Authentication Error",
              description: "Please login again to access coach data.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to load coaches. Please try again.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error('Error loading coaches:', error)
        toast({
          title: "Error",
          description: "Failed to load coaches. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCoaches(false)
      }
    }

    const loadData = async () => {
      // Load courses from backend API
      try {
        setIsLoadingCourses(true)

        // Use the same token for courses
        const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/public/all`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData.courses || [])
          console.log('✅ Loaded courses from backend:', coursesData.courses?.length || 0)
        } else {
          console.error('Failed to load courses:', coursesResponse.statusText)
          // If backend courses fail, continue without courses (non-critical)
          setCourses([])
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        // If courses fail, continue without courses (non-critical)
        setCourses([])
      } finally {
        setIsLoadingCourses(false)
      }

      // Load coaches
      await loadCoaches()
    }

    loadData()
  }, [])



  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Puducherry",
    "Andaman and Nicobar Islands"
  ]

  const bankOptions = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India"
  ]

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Helper functions
  const handleCoursesOfferedToggle = (course: string) => {
    setFormData(prev => ({
      ...prev,
      operational_details: {
        ...prev.operational_details,
        courses_offered: prev.operational_details.courses_offered.includes(course)
          ? prev.operational_details.courses_offered.filter(c => c !== course)
          : [...prev.operational_details.courses_offered, course]
      }
    }))
  }

  const handleCourseAssignmentToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        courses: prev.assignments.courses.includes(courseId)
          ? prev.assignments.courses.filter(c => c !== courseId)
          : [...prev.assignments.courses, courseId]
      }
    }))
  }

  const handleBranchAdminToggle = (coachId: string) => {
    setFormData(prev => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        branch_admins: prev.assignments.branch_admins.includes(coachId)
          ? prev.assignments.branch_admins.filter(c => c !== coachId)
          : [...prev.assignments.branch_admins, coachId]
      }
    }))
  }

  const handleTimingChange = (dayIndex: number, field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      operational_details: {
        ...prev.operational_details,
        timings: prev.operational_details.timings.map((timing, index) =>
          index === dayIndex ? { ...timing, [field]: value } : timing
        )
      }
    }))
  }

  const addTiming = () => {
    if (newTiming.day && newTiming.open && newTiming.close) {
      // Check if day already exists
      const existingTimingIndex = formData.operational_details.timings.findIndex(t => t.day === newTiming.day)
      
      if (existingTimingIndex >= 0) {
        // Update existing timing
        setFormData(prev => ({
          ...prev,
          operational_details: {
            ...prev.operational_details,
            timings: prev.operational_details.timings.map((timing, index) =>
              index === existingTimingIndex ? { ...newTiming } : timing
            )
          }
        }))
      } else {
        // Add new timing
        setFormData(prev => ({
          ...prev,
          operational_details: {
            ...prev.operational_details,
            timings: [...prev.operational_details.timings, { ...newTiming }]
          }
        }))
      }
      
      // Reset form
      setNewTiming({
        day: "",
        open: "07:00",
        close: "19:00"
      })
    }
  }

  const removeTiming = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      operational_details: {
        ...prev.operational_details,
        timings: prev.operational_details.timings.filter((_, index) => index !== dayIndex)
      }
    }))
  }

  const addHoliday = (date: string) => {
    if (date && !formData.operational_details.holidays.includes(date)) {
      setFormData(prev => ({
        ...prev,
        operational_details: {
          ...prev.operational_details,
          holidays: [...prev.operational_details.holidays, date]
        }
      }))
    }
  }

  const removeHoliday = (date: string) => {
    setFormData(prev => ({
      ...prev,
      operational_details: {
        ...prev.operational_details,
        holidays: prev.operational_details.holidays.filter(h => h !== date)
      }
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Branch validation
    if (!formData.branch.name.trim()) newErrors.branchName = "Branch name is required"
    if (!formData.branch.code.trim()) newErrors.branchCode = "Branch code is required"
    if (!formData.branch.email.trim()) newErrors.branchEmail = "Branch email is required"
    if (!formData.branch.phone.trim()) newErrors.branchPhone = "Branch phone is required"
    
    // Address validation
    if (!formData.branch.address.line1.trim()) newErrors.addressLine1 = "Address line 1 is required"
    if (!formData.branch.address.area.trim()) newErrors.addressArea = "Area is required"
    if (!formData.branch.address.city.trim()) newErrors.addressCity = "City is required"
    if (!formData.branch.address.state.trim()) newErrors.addressState = "State is required"
    if (!formData.branch.address.pincode.trim()) newErrors.addressPincode = "Pincode is required"

    // Branch manager validation
    if (!formData.manager_id.trim()) {
      newErrors.managerId = "Branch manager selection is required"
    }

    // Operational details validation
    if (formData.operational_details.courses_offered.length === 0) {
      newErrors.coursesOffered = "At least one course offering is required"
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
      // Get authentication token using TokenManager
      const token = TokenManager.getToken()

      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      console.log('Creating branch with data:', formData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/branches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || result.message || `Failed to create branch (${response.status})`)
      }

      console.log('Branch created successfully:', result)
      setShowSuccessPopup(true)
      
      setTimeout(() => {
        setShowSuccessPopup(false)
        router.push("/dashboard/branches")
      }, 2000)
      
    } catch (error) {
      console.error('Error creating branch:', error)
      alert(`Error creating branch: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Create Branch" />

      <main className="w-full p-4 lg:p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/branches")}
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Branches</span>
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Branch</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 2x2 Card Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Left Card - Branch & Address Information */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-yellow-600" />
                  <span>Branch & Address Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Branch Basic Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branchName">Branch Name *</Label>
                      <Input
                        id="branchName"
                        value={formData.branch.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          branch: { ...formData.branch, name: e.target.value }
                        })}
                        placeholder="Enter branch name"
                        className={errors.branchName ? "border-red-500" : ""}
                      />
                      {errors.branchName && <p className="text-red-500 text-sm">{errors.branchName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchCode">Branch Code *</Label>
                      <Input
                        id="branchCode"
                        value={formData.branch.code}
                        onChange={(e) => setFormData({
                          ...formData,
                          branch: { ...formData.branch, code: e.target.value }
                        })}
                        placeholder="Enter branch code (e.g., RMA01)"
                        className={errors.branchCode ? "border-red-500" : ""}
                      />
                      {errors.branchCode && <p className="text-red-500 text-sm">{errors.branchCode}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branchEmail">Email *</Label>
                      <Input
                        id="branchEmail"
                        type="email"
                        value={formData.branch.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          branch: { ...formData.branch, email: e.target.value }
                        })}
                        placeholder="Enter branch email"
                        className={errors.branchEmail ? "border-red-500" : ""}
                      />
                      {errors.branchEmail && <p className="text-red-500 text-sm">{errors.branchEmail}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchPhone">Phone *</Label>
                      <Input
                        id="branchPhone"
                        value={formData.branch.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          branch: { ...formData.branch, phone: e.target.value }
                        })}
                        placeholder="Enter phone number"
                        className={errors.branchPhone ? "border-red-500" : ""}
                      />
                      {errors.branchPhone && <p className="text-red-500 text-sm">{errors.branchPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">Address Details</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                        <Input
                          id="addressLine1"
                          value={formData.branch.address.line1}
                          onChange={(e) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, line1: e.target.value }
                            }
                          })}
                          placeholder="Building/House number and street"
                          className={errors.addressLine1 ? "border-red-500" : ""}
                        />
                        {errors.addressLine1 && <p className="text-red-500 text-sm">{errors.addressLine1}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressArea">Area *</Label>
                        <Input
                          id="addressArea"
                          value={formData.branch.address.area}
                          onChange={(e) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, area: e.target.value }
                            }
                          })}
                          placeholder="Area/Locality"
                          className={errors.addressArea ? "border-red-500" : ""}
                        />
                        {errors.addressArea && <p className="text-red-500 text-sm">{errors.addressArea}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressCity">City *</Label>
                        <Input
                          id="addressCity"
                          value={formData.branch.address.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, city: e.target.value }
                            }
                          })}
                          placeholder="City"
                          className={errors.addressCity ? "border-red-500" : ""}
                        />
                        {errors.addressCity && <p className="text-red-500 text-sm">{errors.addressCity}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressState">State *</Label>
                        <Select
                          value={formData.branch.address.state}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, state: value }
                            }
                          })}
                        >
                          <SelectTrigger className={errors.addressState ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.addressState && <p className="text-red-500 text-sm">{errors.addressState}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressPincode">Pincode *</Label>
                        <Input
                          id="addressPincode"
                          value={formData.branch.address.pincode}
                          onChange={(e) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, pincode: e.target.value }
                            }
                          })}
                          placeholder="Pincode"
                          className={errors.addressPincode ? "border-red-500" : ""}
                        />
                        {errors.addressPincode && <p className="text-red-500 text-sm">{errors.addressPincode}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressCountry">Country</Label>
                        <Select
                          value={formData.branch.address.country}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, country: value }
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Manager */}
                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium">Branch Manager</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerId">Select Branch Manager *</Label>
                    {isLoadingCoaches ? (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Loading coaches...</span>
                      </div>
                    ) : (
                      <Select
                        value={formData.manager_id}
                        onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                        <SelectContent>
                          {coaches.length === 0 ? (
                            <SelectItem value="" disabled>No coaches available</SelectItem>
                          ) : (
                            coaches.map((coach) => (
                              <SelectItem key={coach.id} value={coach.id}>
                                {coach.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.managerId && <p className="text-red-500 text-sm">{errors.managerId}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Right Card - Operational Details */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span>Operational Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Courses Offered */}
                <div className="space-y-2">
                  <Label>Courses Offered *</Label>
                  {isLoadingCourses ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading courses...</span>
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`course-offered-${course.id}`}
                            checked={formData.operational_details.courses_offered.includes(course.id)}
                            onCheckedChange={() => handleCoursesOfferedToggle(course.id)}
                          />
                          <Label htmlFor={`course-offered-${course.id}`} className="text-sm cursor-pointer">
                            <div className="flex flex-col">
                              <span className="font-medium">{course.title}</span>
                              <span className="text-xs text-gray-500">
                                {course.code} • {course.difficulty_level} • {course.pricing.currency} {course.pricing.amount}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No courses available</p>
                    </div>
                  )}
                  {errors.coursesOffered && <p className="text-red-500 text-sm">{errors.coursesOffered}</p>}

                  {formData.operational_details.courses_offered.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.operational_details.courses_offered.map((courseId) => {
                        const course = courses.find(c => c.id === courseId)
                        return course ? (
                          <Badge key={courseId} variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {course.title}
                            <button
                              type="button"
                              onClick={() => handleCoursesOfferedToggle(courseId)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>

                {/* Operating Hours - Dynamic */}
                <div className="space-y-2">
                  <Label>Operating Hours</Label>
                  
                  {/* Add New Timing Form */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                      <div className="space-y-1">
                        <Label className="text-xs">Day</Label>
                        <Select
                          value={newTiming.day}
                          onValueChange={(value) => setNewTiming(prev => ({ ...prev, day: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Open Time</Label>
                        <Input
                          type="time"
                          value={newTiming.open}
                          onChange={(e) => setNewTiming(prev => ({ ...prev, open: e.target.value }))}
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Close Time</Label>
                        <Input
                          type="time"
                          value={newTiming.close}
                          onChange={(e) => setNewTiming(prev => ({ ...prev, close: e.target.value }))}
                          className="text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTiming}
                        disabled={!newTiming.day}
                        className="bg-yellow-50 hover:bg-yellow-100 border-yellow-300"
                      >
                        {formData.operational_details.timings.some(t => t.day === newTiming.day) ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>

                  {/* Display Added Timings */}
                  {formData.operational_details.timings.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <Label className="text-sm font-medium">Configured Operating Hours:</Label>
                      {formData.operational_details.timings.map((timing, index) => (
                        <div key={`${timing.day}-${index}`} className="grid grid-cols-4 gap-2 items-center p-2 bg-white border rounded">
                          <div className="font-medium text-sm">{timing.day}</div>
                          <Input
                            type="time"
                            value={timing.open}
                            onChange={(e) => handleTimingChange(index, 'open', e.target.value)}
                            className="text-xs"
                          />
                          <Input
                            type="time"
                            value={timing.close}
                            onChange={(e) => handleTimingChange(index, 'close', e.target.value)}
                            className="text-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTiming(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.operational_details.timings.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No operating hours configured yet. Add days and times above.</p>
                  )}
                </div>

                {/* Holidays */}
                <div className="space-y-2">
                  <Label>Holidays</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      id="holidayDate"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          addHoliday(input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.getElementById('holidayDate') as HTMLInputElement
                        addHoliday(input.value)
                        input.value = ''
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.operational_details.holidays.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto">
                      {formData.operational_details.holidays.map((holiday) => (
                        <Badge key={holiday} variant="secondary" className="bg-blue-100 text-blue-800">
                          {holiday}
                          <button
                            type="button"
                            onClick={() => removeHoliday(holiday)}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Left Card - Course & Staff Assignments */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-yellow-600" />
                  <span>Course & Staff Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Accessories Available */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessoriesAvailable"
                    checked={formData.assignments.accessories_available}
                    onCheckedChange={(checked) => setFormData({
                      ...formData,
                      assignments: { ...formData.assignments, accessories_available: !!checked }
                    })}
                  />
                  <Label htmlFor="accessoriesAvailable">Accessories Available at Branch</Label>
                </div>

                {/* Course Assignments */}
                <div className="space-y-2">
                  <Label>Assign Courses to Branch</Label>
                  {isLoadingCourses ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading courses...</span>
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`course-assign-${course.id}`}
                            checked={formData.assignments.courses.includes(course.id)}
                            onCheckedChange={() => handleCourseAssignmentToggle(course.id)}
                          />
                          <Label htmlFor={`course-assign-${course.id}`} className="text-sm cursor-pointer">
                            <div className="flex flex-col">
                              <span className="font-medium">{course.title}</span>
                              <span className="text-xs text-gray-500">
                                {course.code} • {course.difficulty_level} • {course.pricing.currency} {course.pricing.amount}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No courses available</p>
                    </div>
                  )}

                  {formData.assignments.courses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto">
                      {formData.assignments.courses.map((courseId) => {
                        const course = courses.find((c: Course) => c.id === courseId)
                        return course ? (
                          <Badge key={courseId} variant="secondary" className="bg-green-100 text-green-800">
                            {course.title}
                            <button
                              type="button"
                              onClick={() => handleCourseAssignmentToggle(courseId)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>

                {/* Coach Admins */}
                <div className="space-y-2">
                  <Label>Assign Coach Admins</Label>
                  {isLoadingCoaches ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading coaches...</span>
                    </div>
                  ) : coaches.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-32 overflow-y-auto">
                      {coaches.map((coach) => (
                        <div key={coach.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`admin-${coach.id}`}
                            checked={formData.assignments.branch_admins.includes(coach.id)}
                            onCheckedChange={() => handleBranchAdminToggle(coach.id)}
                          />
                          <Label htmlFor={`admin-${coach.id}`} className="text-sm cursor-pointer">
                            {coach.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No coaches available</p>
                    </div>
                  )}

                  {formData.assignments.branch_admins.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto">
                      {formData.assignments.branch_admins.map((coachId) => {
                        const coach = coaches.find(c => c.id === coachId)
                        return coach ? (
                          <Badge key={coachId} variant="secondary" className="bg-purple-100 text-purple-800">
                            {coach.name}
                            <button
                              type="button"
                              onClick={() => handleBranchAdminToggle(coachId)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Right Card - Bank Details */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                  <span>Bank Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select
                      value={formData.bank_details.bank_name}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        bank_details: { ...formData.bank_details, bank_name: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankOptions.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bank_details.account_number}
                      onChange={(e) => setFormData({
                        ...formData,
                        bank_details: { ...formData.bank_details, account_number: e.target.value }
                      })}
                      placeholder="Enter account number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={formData.bank_details.upi_id}
                      onChange={(e) => setFormData({
                        ...formData,
                        bank_details: { ...formData.bank_details, upi_id: e.target.value }
                      })}
                      placeholder="Enter UPI ID (e.g., name@ybl)"
                    />
                  </div>
                </div>

                {/* Bank Details Summary */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Note:</span> Bank details are optional but recommended for payment processing.</p>
                    <p>UPI ID format: username@bankcode (e.g., john@paytm)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 py-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/branches")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Branch...</span>
                </div>
              ) : (
                "Create Branch"
              )}
            </Button>
          </div>
        </form>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Branch Created Successfully!</h3>
            <p className="text-gray-600 mb-4">The new branch has been added to your system.</p>
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  )
}
