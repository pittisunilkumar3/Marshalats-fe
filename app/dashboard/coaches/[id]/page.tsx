"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  Users,
  Clock,
  Award,
  Edit,
  Building2,
  Star,
  Target,
  GraduationCap,
  Briefcase
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface CoachDetails {
  id: string
  full_name: string
  contact_info: {
    email: string
    phone: string
    address?: {
      street?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
  areas_of_expertise: string[]
  qualifications?: string[]
  certifications?: string[]
  hire_date?: string
  is_active: boolean
  branch_assignments?: string[]
  bio?: string
  experience_years?: number
  created_at: string
  updated_at: string
  // Performance metrics
  total_students?: number
  active_courses?: number
  student_satisfaction?: number
  retention_rate?: number
}

interface CourseAssignment {
  id: string
  course_name: string
  difficulty_level: string
  enrolled_students: number
  schedule?: string
  branch_name?: string
  status: 'active' | 'completed' | 'upcoming'
}

interface StudentAssignment {
  id: string
  student_name: string
  course_name: string
  enrollment_date: string
  progress: number
  status: 'active' | 'completed' | 'paused'
}

export default function CoachDetailPage() {
  const params = useParams()
  const router = useRouter()
  const coachId = params.id as string

  const [coach, setCoach] = useState<CoachDetails | null>(null)
  const [courseAssignments, setCourseAssignments] = useState<CourseAssignment[]>([])
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoachDetails()
  }, [coachId])

  const fetchCoachDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = TokenManager.getToken()
      if (!token) {
        setError("Authentication required. Please login again.")
        return
      }

      // Fetch coach details
      const coachResponse = await fetch(`http://localhost:8003/coaches/${coachId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!coachResponse.ok) {
        if (coachResponse.status === 404) {
          setError("Coach not found")
          return
        }
        throw new Error(`Failed to fetch coach: ${coachResponse.status}`)
      }

      const coachData = await coachResponse.json()
      setCoach(coachData)

      // Fetch related data in parallel
      await Promise.all([
        fetchCourseAssignments(token),
        fetchStudentAssignments(token)
      ])

    } catch (err: any) {
      console.error('Error fetching coach details:', err)
      setError(err.message || 'Failed to load coach details')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseAssignments = async (token: string) => {
    try {
      // Mock course assignments - in real app, this would be an API call
      const mockCourses: CourseAssignment[] = [
        {
          id: 'course-1',
          course_name: 'Karate Basics',
          difficulty_level: 'Beginner',
          enrolled_students: 15,
          schedule: 'Mon, Wed, Fri 6:00 PM',
          branch_name: 'Downtown Branch',
          status: 'active'
        },
        {
          id: 'course-2',
          course_name: 'Advanced Self Defense',
          difficulty_level: 'Advanced',
          enrolled_students: 8,
          schedule: 'Tue, Thu 7:00 PM',
          branch_name: 'Downtown Branch',
          status: 'active'
        }
      ]
      setCourseAssignments(mockCourses)
    } catch (err) {
      console.error('Error fetching course assignments:', err)
    }
  }

  const fetchStudentAssignments = async (token: string) => {
    try {
      // Mock student assignments - in real app, this would be an API call
      const mockStudents: StudentAssignment[] = [
        {
          id: 'student-1',
          student_name: 'John Doe',
          course_name: 'Karate Basics',
          enrollment_date: '2024-01-15',
          progress: 75,
          status: 'active'
        },
        {
          id: 'student-2',
          student_name: 'Jane Smith',
          course_name: 'Advanced Self Defense',
          enrollment_date: '2024-02-01',
          progress: 60,
          status: 'active'
        }
      ]
      setStudentAssignments(mockStudents)
    } catch (err) {
      console.error('Error fetching student assignments:', err)
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/coaches/edit/${coachId}`)
  }

  const handleBack = () => {
    router.push('/dashboard/coaches')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coach Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Coaches
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

  if (!coach) {
    return null
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
                  Back to Coaches
                </Button>
                <div className="text-sm text-gray-500">
                  Dashboard &gt; Coaches &gt; {coach.full_name}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {coach.full_name}
                </h1>
                <Badge 
                  variant={coach.is_active ? "default" : "secondary"}
                  className={coach.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {coach.is_active ? "Active" : "Inactive"}
                </Badge>
                {coach.experience_years && (
                  <Badge variant="outline">
                    {coach.experience_years} years experience
                  </Badge>
                )}
              </div>
            </div>
            
            <Button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Edit className="w-4 h-4 mr-2" />
              Edit Coach
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </h3>
                    <p className="text-sm text-gray-600">{coach.contact_info.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </h3>
                    <p className="text-sm text-gray-600">{coach.contact_info.phone}</p>
                  </div>

                  {coach.hire_date && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Hire Date
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(coach.hire_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {coach.experience_years && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Experience</h3>
                      <p className="text-sm text-gray-600">{coach.experience_years} years</p>
                    </div>
                  )}
                </div>

                {/* Areas of Expertise */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coach.areas_of_expertise.map((expertise, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {expertise}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                {coach.qualifications && coach.qualifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Qualifications
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {coach.qualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {qualification}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Certifications */}
                {coach.certifications && coach.certifications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {coach.certifications.map((certification, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {certification}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {coach.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Biography</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{coach.bio}</p>
                  </div>
                )}

                {/* Address */}
                {coach.contact_info.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address
                    </h3>
                    <div className="text-sm text-gray-600">
                      {coach.contact_info.address.street && <p>{coach.contact_info.address.street}</p>}
                      {(coach.contact_info.address.city || coach.contact_info.address.state || coach.contact_info.address.postal_code) && (
                        <p>
                          {[coach.contact_info.address.city, coach.contact_info.address.state, coach.contact_info.address.postal_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      {coach.contact_info.address.country && <p>{coach.contact_info.address.country}</p>}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Joined</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(coach.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(coach.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Assignments ({courseAssignments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No course assignments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseAssignments.map((course) => (
                      <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{course.course_name}</h4>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(course.status)}`}
                          >
                            {course.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Level:</span> {course.difficulty_level}
                          </div>
                          <div>
                            <span className="font-medium">Students:</span> {course.enrolled_students}
                          </div>
                          {course.branch_name && (
                            <div>
                              <span className="font-medium">Branch:</span> {course.branch_name}
                            </div>
                          )}
                        </div>

                        {course.schedule && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Schedule:</span> {course.schedule}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Student Assignments ({studentAssignments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No student assignments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentAssignments.slice(0, 10).map((student) => (
                      <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{student.student_name}</h4>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getStatusColor(student.status)}`}
                          >
                            {student.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Course:</span> {student.course_name}
                          </div>
                          <div>
                            <span className="font-medium">Enrolled:</span> {' '}
                            {new Date(student.enrollment_date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{student.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {studentAssignments.length > 10 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        ... and {studentAssignments.length - 10} more students
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Students</span>
                  </div>
                  <span className="font-semibold">{coach.total_students || studentAssignments.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Active Courses</span>
                  </div>
                  <span className="font-semibold">{coach.active_courses || courseAssignments.filter(c => c.status === 'active').length}</span>
                </div>

                {coach.student_satisfaction && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="text-sm text-gray-600">Satisfaction</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{coach.student_satisfaction.toFixed(1)}</span>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                  </div>
                )}

                {coach.retention_rate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="text-sm text-gray-600">Retention Rate</span>
                    </div>
                    <span className="font-semibold">{coach.retention_rate}%</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coach Status */}
            <Card>
              <CardHeader>
                <CardTitle>Coach Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge
                      variant={coach.is_active ? "default" : "secondary"}
                      className={coach.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {coach.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Coach ID</span>
                    <span className="text-sm font-mono text-gray-900">{coach.id}</span>
                  </div>

                  {coach.branch_assignments && coach.branch_assignments.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Branch Assignments</span>
                      <div className="space-y-1">
                        {coach.branch_assignments.map((branch, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {branch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                  onClick={() => router.push(`/dashboard/coaches/edit/${coachId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Coach Details
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/courses?coach_id=${coachId}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Course Assignments
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/students?coach_id=${coachId}`)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Assigned Students
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/schedule?coach_id=${coachId}`)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/performance?coach_id=${coachId}`)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Performance Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
