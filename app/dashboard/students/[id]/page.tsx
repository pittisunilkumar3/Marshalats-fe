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
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  CreditCard,
  Clock,
  Award,
  Edit,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface StudentDetails {
  id: string
  student_id?: string
  full_name: string
  email: string
  phone: string
  date_of_birth?: string
  gender?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  emergency_contact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  is_active: boolean
  role: string
  created_at: string
  updated_at: string
  // Course enrollment data
  courses?: Array<{
    course_id: string
    course_name: string
    level: string
    duration: string
    enrollment_date: string
    completion_date?: string
    progress?: number
    status: 'active' | 'completed' | 'paused' | 'cancelled'
  }>
  // Additional computed data
  total_courses?: number
  completed_courses?: number
  attendance_percentage?: number
  outstanding_balance?: number
}

interface EnrollmentHistory {
  id: string
  course_name: string
  enrollment_date: string
  completion_date?: string
  status: string
  progress: number
  grade?: string
}

interface PaymentRecord {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  status: 'completed' | 'pending' | 'failed'
  description: string
}

interface AttendanceRecord {
  date: string
  course_name: string
  status: 'present' | 'absent' | 'late'
  duration_minutes?: number
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentHistory[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStudentDetails()
  }, [studentId])

  const fetchStudentDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = TokenManager.getToken()
      if (!token) {
        setError("Authentication required. Please login again.")
        return
      }

      // Fetch student details
      const studentResponse = await fetch(`http://localhost:8003/users/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!studentResponse.ok) {
        if (studentResponse.status === 404) {
          setError("Student not found")
          return
        }
        throw new Error(`Failed to fetch student: ${studentResponse.status}`)
      }

      const studentData = await studentResponse.json()
      setStudent(studentData.user || studentData)

      // Fetch related data in parallel
      await Promise.all([
        fetchEnrollmentHistory(token),
        fetchPaymentHistory(token),
        fetchAttendanceRecords(token)
      ])

    } catch (err: any) {
      console.error('Error fetching student details:', err)
      setError(err.message || 'Failed to load student details')
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrollmentHistory = async (token: string) => {
    try {
      // This would be a real API call to get enrollment history
      // For now, we'll use mock data based on the student's courses
      if (student?.courses) {
        const history = student.courses.map((course, index) => ({
          id: `enrollment-${index}`,
          course_name: course.course_name,
          enrollment_date: course.enrollment_date,
          completion_date: course.completion_date,
          status: course.status,
          progress: course.progress || 0,
          grade: course.status === 'completed' ? 'A' : undefined
        }))
        setEnrollmentHistory(history)
      }
    } catch (err) {
      console.error('Error fetching enrollment history:', err)
    }
  }

  const fetchPaymentHistory = async (token: string) => {
    try {
      // Mock payment data - in real app, this would be an API call
      const mockPayments: PaymentRecord[] = [
        {
          id: 'payment-1',
          amount: 5000,
          payment_date: '2024-01-15',
          payment_method: 'Credit Card',
          status: 'completed',
          description: 'Course enrollment fee'
        },
        {
          id: 'payment-2',
          amount: 3000,
          payment_date: '2024-02-15',
          payment_method: 'Bank Transfer',
          status: 'completed',
          description: 'Monthly fee'
        }
      ]
      setPaymentHistory(mockPayments)
    } catch (err) {
      console.error('Error fetching payment history:', err)
    }
  }

  const fetchAttendanceRecords = async (token: string) => {
    try {
      // Mock attendance data - in real app, this would be an API call
      const mockAttendance: AttendanceRecord[] = [
        {
          date: '2024-01-20',
          course_name: 'Karate Basics',
          status: 'present',
          duration_minutes: 60
        },
        {
          date: '2024-01-22',
          course_name: 'Karate Basics',
          status: 'present',
          duration_minutes: 60
        },
        {
          date: '2024-01-24',
          course_name: 'Karate Basics',
          status: 'absent'
        }
      ]
      setAttendanceRecords(mockAttendance)
    } catch (err) {
      console.error('Error fetching attendance records:', err)
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/students/edit/${studentId}`)
  }

  const handleBack = () => {
    router.push('/dashboard/students')
  }

  const calculateAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age > 0 ? age : null
    } catch {
      return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'paused':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'late':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Students
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

  if (!student) {
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
                  Back to Students
                </Button>
                <div className="text-sm text-gray-500">
                  Dashboard &gt; Students &gt; {student.full_name}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {student.full_name}
                </h1>
                <Badge 
                  variant={student.is_active ? "default" : "secondary"}
                  className={student.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {student.is_active ? "Active" : "Inactive"}
                </Badge>
                {student.student_id && (
                  <Badge variant="outline">
                    ID: {student.student_id}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Edit className="w-4 h-4 mr-2" />
              Edit Student
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </h3>
                    <p className="text-sm text-gray-600">{student.phone || 'Not provided'}</p>
                  </div>

                  {student.date_of_birth && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date of Birth
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(student.date_of_birth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {calculateAge(student.date_of_birth) && (
                          <span className="ml-2 text-gray-500">
                            (Age: {calculateAge(student.date_of_birth)})
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {student.gender && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Gender</h3>
                      <p className="text-sm text-gray-600 capitalize">{student.gender}</p>
                    </div>
                  )}
                </div>

                {/* Address */}
                {student.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address
                    </h3>
                    <div className="text-sm text-gray-600">
                      {student.address.street && <p>{student.address.street}</p>}
                      {(student.address.city || student.address.state || student.address.postal_code) && (
                        <p>
                          {[student.address.city, student.address.state, student.address.postal_code]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      {student.address.country && <p>{student.address.country}</p>}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {student.emergency_contact && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Emergency Contact
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p><strong>{student.emergency_contact.name}</strong></p>
                      {student.emergency_contact.phone && <p>Phone: {student.emergency_contact.phone}</p>}
                      {student.emergency_contact.relationship && (
                        <p>Relationship: {student.emergency_contact.relationship}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Enrolled</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(student.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Last Updated</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(student.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Enrollment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Enrollment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollmentHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No course enrollment history available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollmentHistory.map((enrollment) => (
                      <div key={enrollment.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{enrollment.course_name}</h4>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(enrollment.status)}
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                enrollment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                enrollment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {enrollment.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Enrolled:</span> {' '}
                            {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </div>
                          {enrollment.completion_date && (
                            <div>
                              <span className="font-medium">Completed:</span> {' '}
                              {new Date(enrollment.completion_date).toLocaleDateString()}
                            </div>
                          )}
                          {enrollment.grade && (
                            <div>
                              <span className="font-medium">Grade:</span> {enrollment.grade}
                            </div>
                          )}
                        </div>

                        {enrollment.progress > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No attendance records available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceRecords.slice(0, 10).map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            {getAttendanceIcon(record.status)}
                            <span className="font-medium text-gray-900">{record.course_name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            {record.duration_minutes && (
                              <span className="ml-2">• {record.duration_minutes} min</span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </Badge>
                      </div>
                    ))}
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
                    <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Courses</span>
                  </div>
                  <span className="font-semibold">{student.total_courses || student.courses?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold">
                    {student.completed_courses || student.courses?.filter(c => c.status === 'completed').length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                  </div>
                  <span className="font-semibold">
                    {student.attendance_percentage ||
                     Math.round((attendanceRecords.filter(r => r.status === 'present').length /
                                Math.max(attendanceRecords.length, 1)) * 100) || 0}%
                  </span>
                </div>

                {student.outstanding_balance !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-sm text-gray-600">Outstanding</span>
                    </div>
                    <span className={`font-semibold ${student.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{student.outstanding_balance.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No payment history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentHistory.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{payment.description}</p>
                          <p className="mt-1">
                            {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Status */}
            <Card>
              <CardHeader>
                <CardTitle>Student Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge
                      variant={student.is_active ? "default" : "secondary"}
                      className={student.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {student.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Student ID</span>
                    <span className="text-sm font-mono text-gray-900">
                      {student.student_id || student.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role</span>
                    <Badge variant="outline" className="text-xs">
                      {student.role}
                    </Badge>
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
                  onClick={() => router.push(`/dashboard/students/edit/${studentId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Student Details
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/enrollments?student_id=${studentId}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Enrollments
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/payments?student_id=${studentId}`)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Payment History
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/dashboard/attendance?student_id=${studentId}`)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Attendance Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
