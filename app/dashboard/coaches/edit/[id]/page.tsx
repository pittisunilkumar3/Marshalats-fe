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
import { ArrowLeft, User, Award, MapPin, Phone, X, Loader2, AlertCircle } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

export default function EditCoachPage() {
  const router = useRouter()
  const params = useParams()
  const coachId = params.id as string

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "", // Optional password field for updates
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

  // Dynamic data states
  const [designations, setDesignations] = useState<string[]>([])
  const [specializations, setSpecializations] = useState<string[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [courses, setCourses] = useState<string[]>([])

  // Loading states for dynamic data
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(true)
  const [isLoadingSpecializations, setIsLoadingSpecializations] = useState(true)
  const [isLoadingBranches, setIsLoadingBranches] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)

  // Debug effect to log branch selection state
  useEffect(() => {
    if (!isLoading && !isLoadingBranches) {
      console.log("Branch selection debug:", {
        formDataBranch: formData.branch,
        availableBranches: branches.map(b => ({ id: b.id, name: b.name })),
        branchMatch: branches.find(b => b.id === formData.branch)
      })
    }
  }, [formData.branch, branches, isLoading, isLoadingBranches])

  // Fetch coach data and dynamic options on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true)

        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        // Fetch all data in parallel
        const [coachResponse, branchesResponse, coursesResponse] = await Promise.allSettled([
          // Fetch coach data
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${coachId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          // Fetch branches
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/branches?active_only=true&limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          // Fetch courses
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses?active_only=true&limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        // Handle coach data
        if (coachResponse.status === 'fulfilled' && coachResponse.value.ok) {
          const coachData = await coachResponse.value.json()

          // Map API data to form structure
          console.log("Loading coach data:", {
            coachId: coachData.id,
            currentBranchId: coachData.branch_id,
            coachData: coachData
          })
          setFormData({
            firstName: coachData.personal_info?.first_name || "",
            lastName: coachData.personal_info?.last_name || "",
            email: coachData.contact_info?.email || "",
            phone: coachData.contact_info?.phone || "",
            password: "", // Keep empty for edit form - user can optionally change it
            gender: coachData.personal_info?.gender || "",
            dateOfBirth: coachData.personal_info?.date_of_birth?.split('T')[0] || "",
            address: coachData.address_info?.address || "",
            area: coachData.address_info?.area || "",
            city: coachData.address_info?.city || "",
            state: coachData.address_info?.state || "",
            zipCode: coachData.address_info?.zip_code || "",
            country: coachData.address_info?.country || "India",
            designation: coachData.professional_info?.designation_id || "",
            experience: coachData.professional_info?.professional_experience || "",
            qualifications: coachData.professional_info?.education_qualification || "",
            certifications: (coachData.professional_info?.certifications || []).join(', '),
            specializations: coachData.areas_of_expertise || [],
            // Branch assignment from coach data
            branch: coachData.branch_id || "",
            courses: coachData.assignment_details?.courses || [],
            salary: coachData.assignment_details?.salary?.toString() || "",
            joinDate: coachData.assignment_details?.join_date?.split('T')[0] || "",
            emergencyContactName: coachData.emergency_contact?.name || "",
            emergencyContactPhone: coachData.emergency_contact?.phone || "",
            emergencyContactRelation: coachData.emergency_contact?.relationship || "",
            achievements: coachData.additional_info?.achievements || "",
            notes: coachData.additional_info?.notes || "",
          })
        } else {
          if (coachResponse.status === 'fulfilled' && coachResponse.value.status === 404) {
            throw new Error("Coach not found")
          }
          throw new Error("Failed to fetch coach data")
        }

        // Set fallback data for designations and specializations
        setDesignations([
          "Senior Master",
          "Master Instructor",
          "Senior Instructor",
          "Instructor",
          "Assistant Instructor",
          "Head Coach",
          "Coach",
          "Assistant Coach"
        ])
        setIsLoadingDesignations(false)

        setSpecializations([
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
        ])
        setIsLoadingSpecializations(false)

        // Handle branches data
        if (branchesResponse.status === 'fulfilled' && branchesResponse.value.ok) {
          const branchesData = await branchesResponse.value.json()
          const branchesList = (branchesData.branches || []).map((branch: any) => ({
            id: branch.id,
            name: branch.branch?.name || branch.name
          }))
          setBranches(branchesList)
          console.log("Loaded branches:", branchesList)
        } else {
          // Fallback to hardcoded branches if API fails
          setBranches([
            { id: "branch-1", name: "Madhapur Branch" },
            { id: "branch-2", name: "Hitech City Branch" },
            { id: "branch-3", name: "Gachibowli Branch" },
            { id: "branch-4", name: "Kondapur Branch" },
            { id: "branch-5", name: "Kukatpally Branch" }
          ])
        }
        setIsLoadingBranches(false)

        // Handle courses data
        if (coursesResponse.status === 'fulfilled' && coursesResponse.value.ok) {
          const coursesData = await coursesResponse.value.json()
          const coursesList = (coursesData.courses || []).map((course: any) =>
            course.title || course.name
          )
          setCourses(coursesList)
        } else {
          // Fallback to hardcoded courses if API fails
          setCourses([
            "Taekwondo Basics",
            "Advanced Karate",
            "Kung Fu Fundamentals",
            "Self Defense for Women",
            "Mixed Martial Arts",
            "Kids Martial Arts",
            "Adult Fitness Boxing",
            "Traditional Dance Forms"
          ])
        }
        setIsLoadingCourses(false)

      } catch (error) {
        console.error("Error fetching data:", error)
        setErrors({ general: error instanceof Error ? error.message : 'Failed to load data' })
        setIsLoadingDesignations(false)
        setIsLoadingSpecializations(false)
        setIsLoadingBranches(false)
        setIsLoadingCourses(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (coachId) {
      fetchAllData()
    }
  }, [coachId])


  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }))
  }

  const handleCourseToggle = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(course)
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course]
    }))
  }

  const sendCredentialsEmail = async () => {
    setIsSendingEmail(true)
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${coachId}/send-credentials`, {
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

      alert("Login credentials have been sent to the coach's email address")
    } catch (error) {
      console.error("Error sending credentials email:", error)
      alert(error instanceof Error ? error.message : "Failed to send credentials email")
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

    // Password validation (optional for edit)
    if (formData.password.trim()) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long"
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      }
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
      // Prepare coach data for update
      const coachData = {
        personal_info: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth
        },
        contact_info: {
          email: formData.email,
          country_code: "+91",
          phone: formData.phone,
          ...(formData.password.trim() && { password: formData.password })
        },
        address_info: {
          address: formData.address,
          area: formData.area || formData.city,
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

      console.log("Updating coach with data:", coachData)
      console.log("Branch assignment:", {
        selectedBranchId: formData.branch,
        availableBranches: branches.map(b => ({ id: b.id, name: b.name }))
      })

      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${coachId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(coachData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || result.message || `Failed to update coach (${response.status})`)
      }

      console.log("Coach updated successfully:", result)
      setShowSuccessPopup(true)

      setTimeout(() => {
        setShowSuccessPopup(false)
        router.push("/dashboard/coaches")
      }, 2000)

    } catch (error) {
      console.error("Error updating coach:", error)
      alert(`Error updating coach: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Edit Coach" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading coach data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (errors.general) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Edit Coach" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Coach</h2>
              <p className="text-gray-600 mb-4">{errors.general}</p>
              <Button onClick={() => router.push("/dashboard/coaches")} variant="outline">
                Back to Coaches
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Edit Coach" />

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Coach</h1>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  <p className="text-xs text-gray-500">
                    Leave blank to keep current password. If changing, must be at least 8 characters with uppercase, lowercase, number, and special character
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
                      value={formData.branch && branches.some(b => b.id === formData.branch) ? formData.branch : ""}
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
                            <SelectItem key={branch.id || branch} value={branch.id || branch}>
                              {branch.name || branch}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <div key={course} className="flex items-center space-x-2">
                      <Checkbox
                        id={`course-${course}`}
                        checked={formData.courses.includes(course)}
                        onCheckedChange={() => handleCourseToggle(course)}
                      />
                      <Label htmlFor={`course-${course}`} className="text-sm cursor-pointer">
                        {course}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {formData.courses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.courses.map((course) => (
                      <Badge key={course} variant="secondary" className="bg-blue-100 text-blue-800">
                        {course}
                        <button
                          type="button"
                          onClick={() => handleCourseToggle(course)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
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
          <div className="flex justify-between items-center py-6">
            <Button
              type="button"
              onClick={sendCredentialsEmail}
              disabled={isSendingEmail || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSendingEmail ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Email...</span>
                </div>
              ) : (
                "Send Credentials via Email"
              )}
            </Button>

            <div className="flex space-x-4">
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
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Coach...</span>
                  </div>
                ) : (
                  "Update Coach"
                )}
              </Button>
            </div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coach Updated Successfully!</h3>
            <p className="text-gray-600 mb-4">The coach details have been updated.</p>
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  )
}
