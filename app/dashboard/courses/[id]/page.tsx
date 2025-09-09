"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  TrendingUp,
  Award,
  Edit,
  Building2,
  Target,
  Star,
  FileText,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  DollarSign
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface CourseDetails {
  id: string
  name: string
  description?: string
  difficulty_level: string
  duration?: string
  category?: string
  prerequisites?: string[]
  learning_objectives?: string[]
  instructor_id?: string
  instructor_name?: string
  branch_assignments?: string[]
  pricing?: {
    amount: number
    currency: string
  }
  schedule?: {
    days: string[]
    time: string
    duration_minutes: number
  }
  is_active: boolean
  created_at: string
  updated_at: string
  // Course statistics
  total_enrolled?: number
  completion_rate?: number
  average_rating?: number
  total_revenue?: number
}

interface EnrolledStudent {
  id: string
  student_name: string
  enrollment_date: string
  progress: number
  status: 'active' | 'completed' | 'paused' | 'dropped'
  last_activity?: string
  grade?: string
}

interface CourseModule {
  id: string
  title: string
  description: string
  duration_minutes: number
  order: number
  is_completed: boolean
  resources?: string[]
}

interface CourseReview {
  id: string
  student_name: string
  rating: number
  comment: string
  date: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([])
  const [courseModules, setCourseModules] = useState<CourseModule[]>([])
  const [courseReviews, setCourseReviews] = useState<CourseReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = TokenManager.getToken()
      if (!token) {
        setError("Authentication required. Please login again.")
        return
      }

      // Fetch course details
      const courseResponse = await fetch(`http://localhost:8003/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!courseResponse.ok) {
        if (courseResponse.status === 404) {
          setError("Course not found")
          return
        }
        throw new Error(`Failed to fetch course: ${courseResponse.status}`)
      }

      const courseData = await courseResponse.json()
      setCourse(courseData)

      // Fetch related data in parallel
      await Promise.all([
        fetchEnrolledStudents(token),
        fetchCourseModules(token),
        fetchCourseReviews(token)
      ])

    } catch (err: any) {
      console.error('Error fetching course details:', err)
      setError(err.message || 'Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrolledStudents = async (token: string) => {
    try {
      // Mock enrolled students - in real app, this would be an API call
      const mockStudents: EnrolledStudent[] = [
        {
          id: 'student-1',
          student_name: 'John Doe',
          enrollment_date: '2024-01-15',
          progress: 75,
          status: 'active',
          last_activity: '2024-01-20',
          grade: 'A'
        },
        {
          id: 'student-2',
          student_name: 'Jane Smith',
          enrollment_date: '2024-02-01',
          progress: 60,
          status: 'active',
          last_activity: '2024-01-19'
        },
        {
          id: 'student-3',
          student_name: 'Mike Johnson',
          enrollment_date: '2023-12-10',
          progress: 100,
          status: 'completed',
          last_activity: '2024-01-10',
          grade: 'A+'
        }
      ]
      setEnrolledStudents(mockStudents)
    } catch (err) {
      console.error('Error fetching enrolled students:', err)
    }
  }

  const fetchCourseModules = async (token: string) => {
    try {
      // Mock course modules - in real app, this would be an API call
      const mockModules: CourseModule[] = [
        {
          id: 'module-1',
          title: 'Introduction to Basics',
          description: 'Learn the fundamental concepts and principles',
          duration_minutes: 60,
          order: 1,
          is_completed: true,
          resources: ['Video Tutorial', 'Practice Guide', 'Assessment']
        },
        {
          id: 'module-2',
          title: 'Intermediate Techniques',
          description: 'Build upon basic skills with intermediate techniques',
          duration_minutes: 90,
          order: 2,
          is_completed: true,
          resources: ['Video Tutorial', 'Hands-on Practice']
        },
        {
          id: 'module-3',
          title: 'Advanced Applications',
          description: 'Apply advanced techniques in real-world scenarios',
          duration_minutes: 120,
          order: 3,
          is_completed: false,
          resources: ['Video Tutorial', 'Case Studies', 'Final Project']
        }
      ]
      setCourseModules(mockModules)
    } catch (err) {
      console.error('Error fetching course modules:', err)
    }
  }

  const fetchCourseReviews = async (token: string) => {
    try {
      // Mock course reviews - in real app, this would be an API call
      const mockReviews: CourseReview[] = [
        {
          id: 'review-1',
          student_name: 'John Doe',
          rating: 5,
          comment: 'Excellent course! The instructor was very knowledgeable and the content was well-structured.',
          date: '2024-01-15'
        },
        {
          id: 'review-2',
          student_name: 'Jane Smith',
          rating: 4,
          comment: 'Great course overall. Would recommend to anyone looking to learn these skills.',
          date: '2024-01-10'
        }
      ]
      setCourseReviews(mockReviews)
    } catch (err) {
      console.error('Error fetching course reviews:', err)
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/courses/edit/${courseId}`)
  }

  const handleBack = () => {
    router.push('/dashboard/courses')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'dropped':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'active':
        return <PlayCircle className="w-4 h-4 text-blue-600" />
      case 'paused':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'dropped':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
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
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
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

  if (!course) {
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
                  Back to Courses
                </Button>
                <div className="text-sm text-gray-500">
                  Dashboard &gt; Courses &gt; {course.name}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.name}
                </h1>
                <Badge 
                  variant={course.is_active ? "default" : "secondary"}
                  className={course.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {course.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">
                  {course.difficulty_level}
                </Badge>
                {course.category && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {course.category}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                {course.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
                  </div>
                )}

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Difficulty Level
                    </h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {course.difficulty_level}
                    </Badge>
                  </div>

                  {course.duration && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Duration
                      </h3>
                      <p className="text-sm text-gray-600">{course.duration}</p>
                    </div>
                  )}

                  {course.instructor_name && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Instructor
                      </h3>
                      <p className="text-sm text-gray-600">{course.instructor_name}</p>
                    </div>
                  )}

                  {course.pricing && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Pricing
                      </h3>
                      <p className="text-sm text-gray-600">
                        {course.pricing.currency} {course.pricing.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Schedule */}
                {course.schedule && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p><strong>Days:</strong> {course.schedule.days.join(', ')}</p>
                      <p><strong>Time:</strong> {course.schedule.time}</p>
                      <p><strong>Duration:</strong> {course.schedule.duration_minutes} minutes per session</p>
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Prerequisites
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {prerequisite}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Objectives */}
                {course.learning_objectives && course.learning_objectives.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Learning Objectives
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {course.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Branch Assignments */}
                {course.branch_assignments && course.branch_assignments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Available at Branches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {course.branch_assignments.map((branch, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {branch}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Created</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(course.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(course.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Modules/Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Course Curriculum ({courseModules.length} modules)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseModules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No curriculum modules defined yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseModules.map((module) => (
                      <div key={module.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">
                              Module {module.order}
                            </span>
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            {module.is_completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                            <Badge
                              variant="secondary"
                              className={`text-xs ${module.is_completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {module.is_completed ? 'Completed' : 'In Progress'}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {module.duration_minutes} min
                            </span>
                            {module.resources && (
                              <span>
                                <FileText className="w-3 h-3 inline mr-1" />
                                {module.resources.length} resources
                              </span>
                            )}
                          </div>
                        </div>

                        {module.resources && module.resources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-wrap gap-1">
                              {module.resources.map((resource, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enrolled Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Enrolled Students ({enrolledStudents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledStudents.slice(0, 10).map((student) => (
                      <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{student.student_name}</h4>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(student.status)}
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getStatusColor(student.status)}`}
                            >
                              {student.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Enrolled:</span> {' '}
                            {new Date(student.enrollment_date).toLocaleDateString()}
                          </div>
                          {student.last_activity && (
                            <div>
                              <span className="font-medium">Last Activity:</span> {' '}
                              {new Date(student.last_activity).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{student.progress}%</span>
                              {student.grade && (
                                <Badge variant="outline" className="text-xs">
                                  Grade: {student.grade}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Progress value={student.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                    {enrolledStudents.length > 10 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        ... and {enrolledStudents.length - 10} more students
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Student Reviews ({courseReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courseReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseReviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{review.student_name}</h4>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{review.comment}</p>

                        <p className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Course Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Enrolled</span>
                  </div>
                  <span className="font-semibold">{course.total_enrolled || enrolledStudents.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold">
                    {enrolledStudents.filter(s => s.status === 'completed').length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm text-gray-600">Completion Rate</span>
                  </div>
                  <span className="font-semibold">
                    {course.completion_rate ||
                     Math.round((enrolledStudents.filter(s => s.status === 'completed').length /
                                Math.max(enrolledStudents.length, 1)) * 100)}%
                  </span>
                </div>

                {course.average_rating && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="text-sm text-gray-600">Average Rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{course.average_rating.toFixed(1)}</span>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                  </div>
                )}

                {course.total_revenue && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm text-gray-600">Total Revenue</span>
                    </div>
                    <span className="font-semibold">₹{course.total_revenue.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Status */}
            <Card>
              <CardHeader>
                <CardTitle>Course Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge
                      variant={course.is_active ? "default" : "secondary"}
                      className={course.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {course.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Course ID</span>
                    <span className="text-sm font-mono text-gray-900">{course.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <Badge variant="outline" className="text-xs">
                      {course.difficulty_level}
                    </Badge>
                  </div>

                  {course.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                        {course.category}
                      </Badge>
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
                  onClick={() => router.push(`/dashboard/courses/edit/${courseId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Course Details
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/students?course_id=${courseId}`)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Enrolled Students
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/enrollments?course_id=${courseId}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Enrollments
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/curriculum?course_id=${courseId}`)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Edit Curriculum
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/analytics?course_id=${courseId}`)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
