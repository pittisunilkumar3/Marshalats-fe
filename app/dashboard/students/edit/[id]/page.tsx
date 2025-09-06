"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, GraduationCap, MapPin, CreditCard, AlertCircle, UserIcon, MailIcon, PhoneIcon, CalendarIcon } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

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

export default function EditStudent() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    contactNumber: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    branch: "",
    location: "",
    course: "",
    category: "",
    duration: "",
    experienceLevel: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    password: "",
    biometricId: ""
  })

  // Fetch student data, branches, and courses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        // Fetch student data using the users list endpoint (no individual user endpoint exists)
        const studentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?role=student&limit=100`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!studentResponse.ok) {
          throw new Error(`Failed to fetch students data: ${studentResponse.status}`)
        }

        const studentsData = await studentResponse.json()
        const students = studentsData.users || []
        
        // Find the specific student by ID
        const studentData = students.find((student: any) => student.id === studentId)
        
        if (!studentData) {
          throw new Error("Student not found")
        }
        
        // Map API data to form structure - backend uses different field names
        setFormData({
          firstName: studentData.full_name?.split(' ')[0] || "",
          lastName: studentData.full_name?.split(' ').slice(1).join(' ') || "",
          email: studentData.email || "",
          countryCode: "+91",
          contactNumber: studentData.phone?.replace("+91", "") || "",
          gender: studentData.gender || "",
          dob: studentData.date_of_birth || "",
          address: studentData.address?.line1 || "",
          city: studentData.address?.city || "",
          state: studentData.address?.state || "",
          pincode: studentData.address?.pincode || "",
          branch: studentData.branch_id || "",
          location: "",
          course: "",
          category: "",
          duration: "",
          experienceLevel: "",
          medicalConditions: "",
          emergencyContactName: studentData.emergency_contact?.name || "",
          emergencyContactPhone: studentData.emergency_contact?.phone || "",
          emergencyContactRelationship: studentData.emergency_contact?.relationship || "",
          password: "",
          biometricId: studentData.biometric_id || ""
        })

        // Fetch branches and courses in parallel
        const [branchesResponse, coursesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/branches`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json()
          setBranches(branchesData.branches || [])
        }

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          setCourses(coursesData.courses || [])
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        setErrors({ general: error instanceof Error ? error.message : 'Failed to load student data' })
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) {
      fetchData()
    }
  }, [studentId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required"
    if (!formData.gender) newErrors.gender = "Gender is required"

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
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      // Create API payload according to backend User Management API specification
      // Backend expects different field names than what we use in the form
      const apiPayload = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: `${formData.countryCode}${formData.contactNumber}`,
        date_of_birth: formData.dob || undefined,
        gender: formData.gender || undefined,
        biometric_id: formData.biometricId || undefined,
        is_active: true // Keep user active during update
      }

      console.log("Updating student with data:", apiPayload)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiPayload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || result.message || `Failed to update student (${response.status})`)
      }

      console.log("Student updated successfully:", result)
      setShowSuccessPopup(true)

    } catch (error) {
      console.error("Error updating student:", error)
      setErrors({ general: error instanceof Error ? error.message : 'Failed to update student' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/students")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Edit Student" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading student data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (errors.general) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Edit Student" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Student</h2>
              <p className="text-gray-600 mb-4">{errors.general}</p>
              <Button onClick={() => router.push("/dashboard/students")} variant="outline">
                Back to Students
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Edit Student" />

      <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Student</h1>
            <p className="text-gray-600 text-sm sm:text-base">Update student information</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/students")}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <span>← Back to Students</span>
          </Button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 sm:px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Student Information</h2>
            <p className="text-gray-600 text-sm">Update the student details below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Error Display */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">{errors.general}</p>
              </div>
            )}

            {/* Personal Information Section */}
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
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
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
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        placeholder="Enter contact number"
                        className={`ml-2 flex-1 ${errors.contactNumber ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biometricId">Biometric ID</Label>
                  <Input
                    id="biometricId"
                    value={formData.biometricId}
                    onChange={(e) => handleInputChange("biometricId", e.target.value)}
                    placeholder="Enter biometric ID (optional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/students")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isSubmitting ? "Updating..." : "Update Student"}
              </Button>
            </div>
          </form>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Success!</h3>
              <p className="text-gray-600 mb-6">Student has been updated successfully.</p>
              <div className="flex justify-end">
                <Button onClick={handleSuccessOk} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
