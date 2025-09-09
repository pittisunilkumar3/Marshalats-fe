"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  BookOpen, 
  Building2,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface BranchDetails {
  id: string
  branch: {
    name: string
    address: {
      street: string
      city: string
      state: string
      postal_code: string
      country: string
    }
    phone: string
    email?: string
    operating_hours?: {
      monday?: string
      tuesday?: string
      wednesday?: string
      thursday?: string
      friday?: string
      saturday?: string
      sunday?: string
    }
  }
  is_active: boolean
  created_at: string
  updated_at: string
  // Additional computed data
  total_students?: number
  total_coaches?: number
  active_courses?: number
  monthly_revenue?: number
}

interface Course {
  id: string
  name: string
  difficulty_level: string
  enrolled_students: number
  instructor_name?: string
}

interface Coach {
  id: string
  full_name: string
  contact_info: {
    email: string
    phone: string
  }
  areas_of_expertise: string[]
  is_active: boolean
}

export default function BranchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const branchId = params.id as string

  const [branch, setBranch] = useState<BranchDetails | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBranchDetails()
  }, [branchId])

  const fetchBranchDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = TokenManager.getToken()
      if (!token) {
        setError("Authentication required. Please login again.")
        return
      }

      // Fetch branch details
      const branchResponse = await fetch(`http://82.29.165.77:8003/branches/${branchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!branchResponse.ok) {
        if (branchResponse.status === 404) {
          setError("Branch not found")
          return
        }
        throw new Error(`Failed to fetch branch: ${branchResponse.status}`)
      }

      const branchData = await branchResponse.json()
      setBranch(branchData)

      // Fetch related data in parallel
      await Promise.all([
        fetchBranchCourses(token),
        fetchBranchCoaches(token)
      ])

    } catch (err: any) {
      console.error('Error fetching branch details:', err)
      setError(err.message || 'Failed to load branch details')
    } finally {
      setLoading(false)
    }
  }

  const fetchBranchCourses = async (token: string) => {
    try {
      const response = await fetch(`http://82.29.165.77:8003/courses?branch_id=${branchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (err) {
      console.error('Error fetching branch courses:', err)
    }
  }

  const fetchBranchCoaches = async (token: string) => {
    try {
      const response = await fetch(`http://82.29.165.77:8003/coaches?branch_id=${branchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCoaches(data.coaches || [])
      }
    } catch (err) {
      console.error('Error fetching branch coaches:', err)
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/branches/edit/${branchId}`)
  }

  const handleBack = () => {
    router.push('/dashboard/branches')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Branch Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Branches
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!branch) {
    return null
  }

  const formatOperatingHours = (hours: any) => {
    if (!hours) return "Not specified"
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    return days.map((day, index) => {
      const time = hours[day]
      return time ? `${dayNames[index]}: ${time}` : null
    }).filter(Boolean).join(', ') || "Not specified"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Branches
                </Button>
                <div className="text-sm text-gray-500">
                  Dashboard &gt; Branches &gt; {branch.branch.name}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {branch.branch.name}
                </h1>
                <Badge 
                  variant={branch.is_active ? "default" : "secondary"}
                  className={branch.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {branch.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            
            <Button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Edit className="w-4 h-4 mr-2" />
              Edit Branch
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Branch Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Branch Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Address
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{branch.branch.address.street}</p>
                    <p>{branch.branch.address.city}, {branch.branch.address.state} {branch.branch.address.postal_code}</p>
                    <p>{branch.branch.address.country}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </h3>
                    <p className="text-sm text-gray-600">{branch.branch.phone || 'Not provided'}</p>
                  </div>
                  
                  {branch.branch.email && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </h3>
                      <p className="text-sm text-gray-600">{branch.branch.email}</p>
                    </div>
                  )}
                </div>

                {/* Operating Hours */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Operating Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatOperatingHours(branch.branch.operating_hours)}
                  </p>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Created</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(branch.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(branch.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses at this Branch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Courses ({courses.length})
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard/courses')}
                  >
                    View All Courses
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No courses assigned to this branch yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{course.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {course.difficulty_level}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {course.enrolled_students || 0} students
                            </span>
                            {course.instructor_name && (
                              <span className="text-sm text-gray-600">
                                Instructor: {course.instructor_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                    {courses.length > 5 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        ... and {courses.length - 5} more courses
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coaches at this Branch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Coaches ({coaches.length})
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard/coaches')}
                  >
                    View All Coaches
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {coaches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No coaches assigned to this branch yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coaches.slice(0, 5).map((coach) => (
                      <div key={coach.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{coach.full_name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">{coach.contact_info.email}</span>
                            <Badge
                              variant={coach.is_active ? "default" : "secondary"}
                              className={`text-xs ${coach.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {coach.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {coach.areas_of_expertise.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {coach.areas_of_expertise.slice(0, 3).map((expertise, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {expertise}
                                </Badge>
                              ))}
                              {coach.areas_of_expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{coach.areas_of_expertise.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/coaches/${coach.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                    {coaches.length > 5 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        ... and {coaches.length - 5} more coaches
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Students</span>
                  </div>
                  <span className="font-semibold">{branch.total_students || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Active Coaches</span>
                  </div>
                  <span className="font-semibold">{coaches.filter(c => c.is_active).length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm text-gray-600">Active Courses</span>
                  </div>
                  <span className="font-semibold">{courses.length}</span>
                </div>

                {branch.monthly_revenue && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="text-sm text-gray-600">Monthly Revenue</span>
                    </div>
                    <span className="font-semibold">₹{branch.monthly_revenue.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Branch Status */}
            <Card>
              <CardHeader>
                <CardTitle>Branch Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge
                      variant={branch.is_active ? "default" : "secondary"}
                      className={branch.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {branch.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Branch ID</span>
                    <span className="text-sm font-mono text-gray-900">{branch.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/branches/edit/${branchId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Branch Details
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/students?branch_id=${branchId}`)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Branch Students
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/courses?branch_id=${branchId}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Branch Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
