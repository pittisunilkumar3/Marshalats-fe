"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface Student {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  branch_id: string
  date_of_birth?: string
  is_active: boolean
  created_at: string
  address?: {
    line1: string
    area: string
    city: string
    state: string
    pincode: string
    country: string
  }
}

export default function StudentList() {
  const router = useRouter()
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?role=student`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to fetch students (${response.status})`)
        }

        const data = await response.json()
        console.log("Students fetched successfully:", data)

        // Handle different response formats - API returns {users: [...]} for /users endpoint
        const studentsData = data.users || data.students || data || []

        // Ensure studentsData is always an array
        const studentsArray = Array.isArray(studentsData) ? studentsData : []

        setStudents(studentsArray)

      } catch (error) {
        console.error("Error fetching students:", error)
        setError(error instanceof Error ? error.message : 'Failed to fetch students')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])


  const handleAssignClick = () => {
    setShowAssignPopup(true)
  }

  const handleAssignConfirm = () => {
    setShowAssignPopup(false)
    setSelectedBranch("")
    setSelectedCourses([])
  }

  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (studentToDelete !== null) {
      try {
        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${studentToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to delete student (${response.status})`)
        }

        // Remove student from local state
        setStudents((Array.isArray(students) ? students : []).filter(student => student.id !== studentToDelete))
        setStudentToDelete(null)
        setShowDeletePopup(false)

      } catch (error) {
        console.error("Error deleting student:", error)
        alert(`Error deleting student: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleDeleteCancel = () => {
    setStudentToDelete(null)
    setShowDeletePopup(false)
  }

  const handleEditClick = (studentId: string) => {
    router.push(`/dashboard/students/edit/${studentId}`)
  }

  const handleToggleStudent = async (studentId: string) => {
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      const student = (Array.isArray(students) ? students : []).find(s => s.id === studentId)
      if (!student) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${studentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !student.is_active
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || `Failed to update student status (${response.status})`)
      }

      // Update local state
      setStudents((Array.isArray(students) ? students : []).map(s =>
        s.id === studentId ? { ...s, is_active: !s.is_active } : s
      ))

    } catch (error) {
      console.error("Error updating student status:", error)
      alert(`Error updating student status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }



  const handleCourseToggle = (course: string) => {
    setSelectedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  const availableCourses = ["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Students" />

      {/* Main Content */}
      <main className="w-full p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student list</h1>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push("/dashboard/create-student")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
            >
              + Add Student
            </Button>
            <Button
              onClick={handleAssignClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              Assign to Branch
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, ID, location"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Student Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Gender</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Age</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Courses (Expertise)</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Level</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Duration</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Email Id</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Phone Number</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 px-6 text-center text-gray-500">
                      Loading students...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="py-8 px-6 text-center text-red-500">
                      Error: {error}
                    </td>
                  </tr>
                ) : !Array.isArray(students) || students.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 px-6 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  (Array.isArray(students) ? students : []).map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{student.full_name}</td>
                      <td className="py-4 px-6 capitalize">N/A</td>
                      <td className="py-4 px-6">
                        {student.date_of_birth ?
                          new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()
                          : 'N/A'
                        }
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                          Student
                        </Badge>
                      </td>
                      <td className="py-4 px-6">N/A</td>
                      <td className="py-4 px-6">N/A</td>
                      <td className="py-4 px-6">{student.email}</td>
                      <td className="py-4 px-6">{student.phone}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(student.id)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(student.id)}
                            className="p-1 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Switch
                            checked={student.is_active}
                            onCheckedChange={() => handleToggleStudent(student.id)}
                            className="data-[state=checked]:bg-yellow-400"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 py-4 border-t">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" size="sm">
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Assign Popup */}
      {showAssignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign student to branch</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAssignPopup(false)} className="p-1">
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Madhapur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="madhapur">Madhapur</SelectItem>
                    <SelectItem value="hitech-city">Hitech City</SelectItem>
                    <SelectItem value="gachibowli">Gachibowli</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select course</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Kick Boxing" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 space-y-2">
                      {availableCourses.map((course) => (
                        <div key={course} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={course}
                            checked={selectedCourses.includes(course)}
                            onChange={() => handleCourseToggle(course)}
                            className="rounded"
                          />
                          <label htmlFor={course} className="text-sm">
                            {course}
                          </label>
                        </div>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleAssignConfirm} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
              Assign Now
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Student</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleDeleteCancel} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
