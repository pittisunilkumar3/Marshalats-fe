"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building, MapPin, Users, Clock, CreditCard, AlertCircle, Loader2, X } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface FormData {
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
}

interface FormErrors {
  [key: string]: string
}

export default function EditBranch() {
  const router = useRouter()
  const params = useParams()
  const branchId = params.id as string
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

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

  // Dynamic data from APIs
  const [availableManagers, setAvailableManagers] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([])

  // Loading states for dynamic data
  const [isLoadingManagers, setIsLoadingManagers] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true)

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Fetch branch data and dynamic options on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true)

        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        // Fetch branch data and dynamic options in parallel
        const [branchResponse, managersResponse, coursesResponse, adminsResponse] = await Promise.allSettled([
          // Fetch branch data
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/branches/${branchId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          // Fetch managers (coaches with manager designation)
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches?active_only=true&limit=100`, {
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
          }),
          // Fetch admins (users with admin role)
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users?role=admin&limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        // Handle branch data
        if (branchResponse.status === 'fulfilled' && branchResponse.value.ok) {
          const branchData = await branchResponse.value.json()

          // Map API data to form structure
          setFormData({
            branch: {
              name: branchData.branch?.name || "",
              code: branchData.branch?.code || "",
              email: branchData.branch?.email || "",
              phone: branchData.branch?.phone || "",
              address: {
                line1: branchData.branch?.address?.line1 || "",
                area: branchData.branch?.address?.area || "",
                city: branchData.branch?.address?.city || "",
                state: branchData.branch?.address?.state || "",
                pincode: branchData.branch?.address?.pincode || "",
                country: branchData.branch?.address?.country || "India"
              }
            },
            manager_id: branchData.manager_id || "",
            operational_details: {
              courses_offered: branchData.operational_details?.courses_offered || [],
              timings: branchData.operational_details?.timings || [],
              holidays: branchData.operational_details?.holidays || []
            },
            assignments: {
              accessories_available: branchData.assignments?.accessories_available || false,
              courses: branchData.assignments?.courses || [],
              branch_admins: branchData.assignments?.branch_admins || []
            },
            bank_details: {
              bank_name: branchData.bank_details?.bank_name || "",
              account_number: branchData.bank_details?.account_number || "",
              upi_id: branchData.bank_details?.upi_id || ""
            }
          })
        } else {
          if (branchResponse.status === 'fulfilled' && branchResponse.value.status === 404) {
            throw new Error("Branch not found")
          }
          throw new Error("Failed to fetch branch data")
        }

        // Handle managers data
        if (managersResponse.status === 'fulfilled' && managersResponse.value.ok) {
          const managersData = await managersResponse.value.json()
          const managers = (managersData.coaches || []).map((coach: any) => ({
            id: coach.id,
            name: coach.full_name || `${coach.personal_info?.first_name || ''} ${coach.personal_info?.last_name || ''}`.trim()
          }))
          setAvailableManagers(managers)
        }
        setIsLoadingManagers(false)

        // Handle courses data
        if (coursesResponse.status === 'fulfilled' && coursesResponse.value.ok) {
          const coursesData = await coursesResponse.value.json()
          const courses = (coursesData.courses || []).map((course: any) => ({
            id: course.id,
            name: course.title || course.name
          }))
          setAvailableCourses(courses)
        }
        setIsLoadingCourses(false)

        // Handle admins data
        if (adminsResponse.status === 'fulfilled' && adminsResponse.value.ok) {
          const adminsData = await adminsResponse.value.json()
          const admins = (adminsData.users || []).map((admin: any) => ({
            id: admin.id,
            name: admin.full_name || `${admin.first_name || ''} ${admin.last_name || ''}`.trim()
          }))
          setAvailableAdmins(admins)
        }
        setIsLoadingAdmins(false)

      } catch (error) {
        console.error("Error fetching data:", error)
        setErrors({ general: error instanceof Error ? error.message : 'Failed to load data' })
        setIsLoadingManagers(false)
        setIsLoadingCourses(false)
        setIsLoadingAdmins(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (branchId) {
      fetchAllData()
    }
  }, [branchId])

  // Helper functions
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
      // Clear the input
      const input = document.getElementById('holidayDate') as HTMLInputElement
      if (input) input.value = ''
    }
  }

  const removeHoliday = (holidayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      operational_details: {
        ...prev.operational_details,
        holidays: prev.operational_details.holidays.filter((_, index) => index !== holidayIndex)
      }
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.branch.name.trim()) {
      newErrors.branchName = "Branch name is required"
    }

    if (!formData.branch.code.trim()) {
      newErrors.branchCode = "Branch code is required"
    }

    if (!formData.branch.email.trim()) {
      newErrors.branchEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.branch.email)) {
      newErrors.branchEmail = "Please enter a valid email address"
    }

    if (!formData.branch.phone.trim()) {
      newErrors.branchPhone = "Phone number is required"
    }

    if (!formData.branch.address.line1.trim()) {
      newErrors.addressLine1 = "Address line 1 is required"
    }

    if (!formData.branch.address.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.branch.address.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.branch.address.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
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
      const token = TokenManager.getToken()
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token available. Please login again.",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/branches/${branchId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || result.message || `Failed to update branch (${response.status})`)
      }

      console.log("Branch updated successfully:", result)
      setShowSuccessPopup(true)
      
      setTimeout(() => {
        setShowSuccessPopup(false)
        router.push("/dashboard/branches")
      }, 2000)
      
    } catch (error) {
      console.error("Error updating branch:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update branch',
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Edit Branch" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading branch data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (errors.general) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Edit Branch" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Branch</h2>
              <p className="text-gray-600 mb-4">{errors.general}</p>
              <Button onClick={() => router.push("/dashboard/branches")} variant="outline">
                Back to Branches
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Edit Branch" />

      <main className="w-full p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Branch</h1>
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
                        placeholder="Enter street address"
                        className={errors.addressLine1 ? "border-red-500" : ""}
                      />
                      {errors.addressLine1 && <p className="text-red-500 text-sm">{errors.addressLine1}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Area/Locality</Label>
                      <Input
                        id="area"
                        value={formData.branch.address.area}
                        onChange={(e) => setFormData({
                          ...formData,
                          branch: {
                            ...formData.branch,
                            address: { ...formData.branch.address, area: e.target.value }
                          }
                        })}
                        placeholder="Enter area or locality"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.branch.address.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, city: e.target.value }
                            }
                          })}
                          placeholder="Enter city"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
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
                          <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="Telangana">Telangana</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.branch.address.pincode}
                          onChange={(e) => setFormData({
                            ...formData,
                            branch: {
                              ...formData.branch,
                              address: { ...formData.branch.address, pincode: e.target.value }
                            }
                          })}
                          placeholder="Enter pincode"
                          className={errors.pincode ? "border-red-500" : ""}
                        />
                        {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
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
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
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
                    <Label htmlFor="managerId">Select Branch Manager</Label>
                    <Select
                      value={formData.manager_id}
                      onValueChange={(value) => setFormData({ ...formData, manager_id: value })}
                      disabled={isLoadingManagers}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingManagers ? "Loading managers..." : "Select a manager"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableManagers.length > 0 ? (
                          availableManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">No managers available</p>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
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
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Loading courses...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {availableCourses.length > 0 ? (
                        availableCourses.map((course) => (
                          <div key={course.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`course-offered-${course.id}`}
                              checked={formData.operational_details.courses_offered.includes(course.name)}
                              onCheckedChange={() => {
                                const isSelected = formData.operational_details.courses_offered.includes(course.name)
                                const updatedCourses = isSelected
                                  ? formData.operational_details.courses_offered.filter(c => c !== course.name)
                                  : [...formData.operational_details.courses_offered, course.name]

                                setFormData({
                                  ...formData,
                                  operational_details: {
                                    ...formData.operational_details,
                                    courses_offered: updatedCourses
                                  }
                                })
                              }}
                            />
                            <Label htmlFor={`course-offered-${course.id}`} className="text-sm cursor-pointer">
                              {course.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">No courses available</p>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.coursesOffered && <p className="text-red-500 text-sm">{errors.coursesOffered}</p>}

                  {formData.operational_details.courses_offered.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.operational_details.courses_offered.map((course) => (
                        <Badge key={course} variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {course}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedCourses = formData.operational_details.courses_offered.filter(c => c !== course)
                              setFormData({
                                ...formData,
                                operational_details: {
                                  ...formData.operational_details,
                                  courses_offered: updatedCourses
                                }
                              })
                            }}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
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
                      {formData.operational_details.holidays.map((holiday, index) => (
                        <Badge key={holiday} variant="secondary" className="bg-blue-100 text-blue-800">
                          {holiday}
                          <button
                            type="button"
                            onClick={() => removeHoliday(index)}
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
                      assignments: { ...formData.assignments, accessories_available: checked }
                    })}
                  />
                  <Label htmlFor="accessoriesAvailable">Accessories Available at Branch</Label>
                </div>

                {/* Course Assignments */}
                <div className="space-y-2">
                  <Label>Assign Courses to Branch</Label>
                  {isLoadingCourses ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Loading courses...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
                      {availableCourses.length > 0 ? (
                        availableCourses.map((course) => (
                          <div key={course.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`course-assign-${course.id}`}
                              checked={formData.assignments.courses.includes(course.id)}
                              onCheckedChange={() => {
                                const isSelected = formData.assignments.courses.includes(course.id)
                                const updatedCourses = isSelected
                                  ? formData.assignments.courses.filter(c => c !== course.id)
                                  : [...formData.assignments.courses, course.id]

                                setFormData({
                                  ...formData,
                                  assignments: {
                                    ...formData.assignments,
                                    courses: updatedCourses
                                  }
                                })
                              }}
                            />
                            <Label htmlFor={`course-assign-${course.id}`} className="text-sm cursor-pointer">
                              {course.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">No courses available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.assignments.courses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto">
                      {formData.assignments.courses.map((courseId) => {
                        const course = availableCourses.find(c => c.id === courseId)
                        return course ? (
                          <Badge key={courseId} variant="secondary" className="bg-green-100 text-green-800">
                            {course.name}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedCourses = formData.assignments.courses.filter(c => c !== courseId)
                                setFormData({
                                  ...formData,
                                  assignments: {
                                    ...formData.assignments,
                                    courses: updatedCourses
                                  }
                                })
                              }}
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

                {/* Branch Admins */}
                <div className="space-y-2">
                  <Label>Branch Administrators</Label>
                  {isLoadingAdmins ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Loading administrators...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-32 overflow-y-auto">
                      {availableAdmins.length > 0 ? (
                        availableAdmins.map((admin) => (
                          <div key={admin.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`admin-${admin.id}`}
                              checked={formData.assignments.branch_admins.includes(admin.id)}
                              onCheckedChange={() => {
                                const isSelected = formData.assignments.branch_admins.includes(admin.id)
                                const updatedAdmins = isSelected
                                  ? formData.assignments.branch_admins.filter(a => a !== admin.id)
                                  : [...formData.assignments.branch_admins, admin.id]

                                setFormData({
                                  ...formData,
                                  assignments: {
                                    ...formData.assignments,
                                    branch_admins: updatedAdmins
                                  }
                                })
                              }}
                            />
                            <Label htmlFor={`admin-${admin.id}`} className="text-sm cursor-pointer">
                              {admin.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <p className="text-sm">No administrators available</p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.assignments.branch_admins.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.assignments.branch_admins.map((adminId) => {
                        const admin = availableAdmins.find(a => a.id === adminId)
                        return admin ? (
                          <Badge key={adminId} variant="secondary" className="bg-purple-100 text-purple-800">
                            {admin.name}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedAdmins = formData.assignments.branch_admins.filter(a => a !== adminId)
                                setFormData({
                                  ...formData,
                                  assignments: {
                                    ...formData.assignments,
                                    branch_admins: updatedAdmins
                                  }
                                })
                              }}
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
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bank_details.bank_name}
                    onChange={(e) => setFormData({
                      ...formData,
                      bank_details: { ...formData.bank_details, bank_name: e.target.value }
                    })}
                    placeholder="Enter bank name"
                  />
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
                    placeholder="Enter UPI ID"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/branches")}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Branch...
                </>
              ) : (
                'Update Branch'
              )}
            </Button>
          </div>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Branch Updated!</h3>
                <p className="text-gray-600 mb-4">The branch has been successfully updated.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
