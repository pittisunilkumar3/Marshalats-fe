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
import { ArrowLeft, User, Award, MapPin, Phone, X } from "lucide-react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"
import { useToast } from "@/hooks/use-toast"

// Interface definitions for API data
interface Branch {
  id: string
  branch: {
    name: string
    code: string
    email: string
    phone: string
    address: {
      line1: string
      area: string
      city: string
      state: string
      pincode: string
      country: string
    }
  }
  manager_id: string
  operational_details: {
    courses_offered: string[]
    timings: Array<{
      day: string
      open: string
      close: string
    }>
    holidays: string[]
  }
  assignments: {
    accessories_available: boolean
    courses: string[]
    branch_admins: string[]
  }
  bank_details: {
    bank_name: string
    account_number: string
    upi_id: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Course {
  id: string
  title: string
  code: string
  description: string
  martial_art_style_id: string
  difficulty_level: string
  category_id: string
  instructor_id: string
  student_requirements: {
    max_students: number
    min_age: number
    max_age: number
    prerequisites: string[]
  }
  course_content: {
    syllabus: string
    equipment_required: string[]
  }
  media_resources: {
    course_image_url?: string
    promo_video_url?: string
  }
  pricing: {
    currency: string
    amount: number
    branch_specific_pricing: boolean
  }
  settings: {
    offers_certification: boolean
    active: boolean
  }
  created_at: string
  updated_at: string
}

export default function AddCoachPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [createdCoachId, setCreatedCoachId] = useState<string | null>(null)

  // API data state
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoadingBranches, setIsLoadingBranches] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",

    // Professional Information
    designation: "",
    experience: "",
    qualifications: "",
    certifications: "",
    specializations: [] as string[],

    // Assignment Details
    branch: "",
    courses: [] as string[],
    salary: "",
    joinDate: "",

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",

    // Additional Information
    achievements: "",
    notes: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Available options
  const designations = [
    "Senior Master",
    "Master Instructor", 
    "Senior Instructor",
    "Instructor",
    "Assistant Instructor",
    "Head Coach",
    "Coach",
    "Assistant Coach"
  ]

  const specializations = [
    "Taekwondo",
    "Karate", 
    "Kung Fu",
    "Kick Boxing",
    "Self Defense",
    "Mixed Martial Arts",
    "Judo",
    "Jiu-Jitsu",
    "Muay Thai",
    "Boxing",
    "Kuchipudi Dance",
    "Bharatanatyam",
    "Gymnastics",
    "Yoga"
  ]

  // Load data from APIs
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setIsLoadingBranches(true)

        // Get authentication token
        let token = TokenManager.getToken()

        // If no token, try to get one using superadmin credentials for testing
        if (!token) {
          console.log('No token found, attempting to get superadmin token...')
          try {
            const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/superadmin/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: "pittisunilkumar3@gmail.com",
                password: "StrongPassword@123"
              })
            })

            if (loginResponse.ok) {
              const loginData = await loginResponse.json()
              console.log('✅ Got superadmin token for branches')

              // Store the token using TokenManager
              TokenManager.storeAuthData(loginData)
              token = TokenManager.getToken()
            } else {
              console.error('Failed to get superadmin token:', loginResponse.statusText)
              toast({
                title: "Authentication Error",
                description: "Unable to authenticate. Please login manually.",
                variant: "destructive",
              })
              setIsLoadingBranches(false)
              return
            }
          } catch (error) {
            console.error('Error getting superadmin token:', error)
            toast({
              title: "Authentication Error",
              description: "Please login to access branch data.",
              variant: "destructive",
            })
            setIsLoadingBranches(false)
            return
          }
        }

        // Call real backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/branches?limit=100`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Real backend branches data:', data)

          // Set branches data
          setBranches(data.branches || [])
        } else {
          console.error('Failed to load branches:', response.status, response.statusText)
          if (response.status === 401) {
            toast({
              title: "Authentication Error",
              description: "Please login again to access branch data.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Error",
              description: "Failed to load branches. Please try again.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error('Error loading branches:', error)
        toast({
          title: "Error",
          description: "Failed to load branches. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingBranches(false)
      }
    }

    const loadCourses = async () => {
      try {
        setIsLoadingCourses(true)

        // Use public endpoint for courses (no authentication required)
        const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/public/all`, {
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
          toast({
            title: "Error",
            description: "Failed to load courses. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error loading courses:', error)
        toast({
          title: "Error",
          description: "Failed to load courses. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCourses(false)
      }
    }

    const loadData = async () => {
      await Promise.all([loadBranches(), loadCourses()])
    }

    loadData()
  }, [toast])

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }))
  }

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(c => c !== courseId)
        : [...prev.courses, courseId]
    }))
  }

  const sendCredentialsEmail = async () => {
    if (!createdCoachId) {
      toast({
        title: "Error",
        description: "No coach ID available for sending credentials",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${createdCoachId}/send-credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || 'Failed to send credentials email')
      }

      toast({
        title: "Success",
        description: "Login credentials have been sent to the coach's email address",
      })
    } catch (error) {
      console.error("Error sending credentials email:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send credentials email",
        variant: "destructive",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.designation) newErrors.designation = "Designation is required"
    if (!formData.experience) newErrors.experience = "Experience is required"
    if (formData.specializations.length === 0) newErrors.specializations = "At least one specialization is required"

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
      // Prepare coach data according to backend API specification
      const coachData = {
        personal_info: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth
        },
        contact_info: {
          email: formData.email,
          country_code: "+91", // Default for India
          phone: formData.phone,
          password: formData.password
        },
        address_info: {
          address: formData.address,
          area: formData.area || formData.city, // Use area if provided, otherwise city
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country
        },
        professional_info: {
          education_qualification: formData.qualifications,
          professional_experience: formData.experience,
          designation_id: formData.designation,
          certifications: formData.certifications ? formData.certifications.split(',').map(cert => cert.trim()) : []
        },
        areas_of_expertise: formData.specializations,
        branch_id: formData.branch || null  // Include branch assignment
      }

      console.log("Creating coach with data:", coachData)

      // Log branch and course assignments for debugging
      if (formData.branch || formData.courses.length > 0) {
        console.log("Branch and course assignments:", {
          selectedBranch: formData.branch,
          selectedCourses: formData.courses
        })
      }

      // Get authentication token
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      // Call the backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(coachData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || result.message || `Failed to create coach (${response.status})`)
      }

      console.log("Coach created successfully:", result)

      // Store the created coach ID for sending credentials
      if (result.coach && result.coach.id) {
        setCreatedCoachId(result.coach.id)
      } else if (result.id) {
        setCreatedCoachId(result.id)
      }

      setShowSuccessPopup(true)

      // Reset form after successful submission (removed auto-redirect to allow email sending)
      // User can manually navigate using the buttons in the success popup

    } catch (error) {
      console.error("Error creating coach:", error)
      // You might want to show an error message to the user here
      alert(`Error creating coach: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Add Coach" />

      <main className="w-full p-4 lg:p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/coaches")}
              className="flex items-center space-x-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Coaches</span>
            </Button>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Coach</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-yellow-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter secure password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
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

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area/Locality</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="Enter area or locality"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>Professional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Select 
                    value={formData.designation} 
                    onValueChange={(value) => setFormData({ ...formData, designation: value })}
                  >
                    <SelectTrigger className={errors.designation ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience *</Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => setFormData({ ...formData, experience: value })}
                  >
                    <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1 years">0-1 years</SelectItem>
                      <SelectItem value="1-3 years">1-3 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="5-10 years">5-10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specializations *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {specializations.map((specialization) => (
                    <div key={specialization} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialization}
                        checked={formData.specializations.includes(specialization)}
                        onCheckedChange={() => handleSpecializationToggle(specialization)}
                      />
                      <Label htmlFor={specialization} className="text-sm cursor-pointer">
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.specializations && <p className="text-red-500 text-sm">{errors.specializations}</p>}
                
                {formData.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {spec}
                        <button
                          type="button"
                          onClick={() => handleSpecializationToggle(spec)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Textarea
                    id="qualifications"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="Educational qualifications"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="Professional certifications"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-yellow-600" />
                <span>Assignment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Assign to Branch</Label>
                  {isLoadingBranches ? (
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading branches...</span>
                    </div>
                  ) : (
                    <Select
                      value={formData.branch}
                      onValueChange={(value) => setFormData({ ...formData, branch: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <p>No branches available</p>
                          </div>
                        ) : (
                          branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.branch.name} ({branch.branch.code})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinDate">Joining Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assign Courses</Label>
                {isLoadingCourses ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading courses...</span>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={formData.courses.includes(course.id)}
                          onCheckedChange={() => handleCourseToggle(course.id)}
                        />
                        <Label htmlFor={`course-${course.id}`} className="text-sm cursor-pointer">
                          <div className="flex flex-col">
                            <span className="font-medium">{course.title}</span>
                            <span className="text-xs text-gray-500">
                              {course.code} • {course.difficulty_level}
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

                {formData.courses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.courses.map((courseId) => {
                      const course = courses.find(c => c.id === courseId)
                      return course ? (
                        <Badge key={courseId} variant="secondary" className="bg-blue-100 text-blue-800">
                          {course.title}
                          <button
                            type="button"
                            onClick={() => handleCourseToggle(courseId)}
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

              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="Monthly salary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-yellow-600" />
                <span>Emergency Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="Emergency contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    placeholder="Emergency contact phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation">Relation</Label>
                  <Select 
                    value={formData.emergencyContactRelation} 
                    onValueChange={(value) => setFormData({ ...formData, emergencyContactRelation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements & Awards</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Notable achievements, awards, competitions won, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information or special notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 py-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/coaches")}
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
                  <span>Creating Coach...</span>
                </div>
              ) : (
                "Create Coach"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coach Created Successfully!</h3>
            <p className="text-gray-600 mb-6">The new coach has been added to your academy.</p>

            <div className="space-y-3">
              <Button
                onClick={sendCredentialsEmail}
                disabled={isSendingEmail || !createdCoachId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Email...
                  </>
                ) : (
                  "Send Credentials via Email"
                )}
              </Button>

              <Button
                onClick={() => {
                  setShowSuccessPopup(false)
                  router.push("/dashboard/coaches")
                }}
                variant="outline"
                className="w-full"
              >
                Continue to Coaches List
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
