"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Edit, Trash2, X, ToggleLeft, ToggleRight, ChevronDown, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface Course {
  id: string
  title: string
  code: string
  description: string
  difficulty_level: string
  student_requirements: {
    max_students: number
    min_age: number
    max_age: number
    prerequisites: string[]
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

export default function CourseListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showBranchDropdown, setShowBranchDropdown] = useState<number | null>(null)
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/public/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to fetch courses (${response.status})`)
        }

        const data = await response.json()
        console.log("Courses fetched successfully:", data)

        // Handle different response formats
        const coursesData = data.courses || data || []
        setCourses(coursesData)

      } catch (error) {
        console.error("Error fetching courses:", error)
        setError(error instanceof Error ? error.message : 'Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const availableCourses = ["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"]

  const branches = ["Madhapur", "Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka"]

  // Enhanced search functionality - search across multiple fields
  const filteredCourses = courses.filter((course) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      course.title?.toLowerCase().includes(searchLower) ||
      course.id?.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.difficulty_level?.toLowerCase().includes(searchLower) ||
      course.category?.toLowerCase().includes(searchLower)
    )
  })

  const handleAssignClick = () => {
    setShowAssignPopup(true)
    setSelectedBranch("")
    setSelectedCourses(["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts"]) // Pre-select as shown in design
  }

  const handleAssignNow = () => {
    console.log("Assigning courses:", selectedCourses, "to branch:", selectedBranch)
    setShowAssignPopup(false)
  }

  const handleCourseToggle = (course: string) => {
    setSelectedCourses((prev) => (prev.includes(course) ? prev.filter((c) => c !== course) : [...prev, course]))
  }

  const handleViewClick = (courseId: string) => {
    router.push(`/dashboard/courses/${courseId}`)
  }

  const handleEditClick = (courseId: string) => {
    router.push(`/dashboard/courses/edit/${courseId}`)
  }

  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (courseToDelete) {
      try {
        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to delete course (${response.status})`)
        }

        // Remove course from local state
        setCourses((prev) => prev.filter((course) => course.id !== courseToDelete))
        setShowDeletePopup(false)
        setCourseToDelete(null)

      } catch (error) {
        console.error("Error deleting course:", error)
        alert(`Error deleting course: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleToggleEnable = async (courseId: string) => {
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      const course = courses.find(c => c.id === courseId)
      if (!course) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          settings: {
            ...course.settings,
            active: !course.settings.active
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || `Failed to update course status (${response.status})`)
      }

      // Update local state
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? { ...course, settings: { ...course.settings, active: !course.settings.active } }
            : course
        )
      )

    } catch (error) {
      console.error("Error updating course status:", error)
      alert(`Error updating course status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Courses" />

      <main className="w-full p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course list</h1>
          <Button
            onClick={() => router.push("/dashboard/create-course")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
          >
            + Add Course
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, ID, Location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Course Name:</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Course Available in branches</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">No of masters assigned</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">No. of Student choose</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr key={course.id} className={`border-b hover:bg-gray-50 ${!course.enabled ? "opacity-50" : ""}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xl">{course.icon}</span>
                          </div>
                          <span className="font-medium text-gray-900">{course.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <span className="text-gray-700">{course.branches} Branches</span>
                          {index === 1 && showBranchDropdown === course.id && (
                            <div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[150px]">
                              {course.branchLocations.map((location, idx) => (
                                <div key={idx} className="py-1 px-2 hover:bg-gray-100 cursor-pointer text-sm">
                                  {location}
                                </div>
                              ))}
                            </div>
                          )}
                          {index === 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowBranchDropdown(showBranchDropdown === course.id ? null : course.id)}
                              className="ml-2 p-1 h-6 w-6"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">{course.masters} masters</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">{course.students} students</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm"
                            onClick={handleAssignClick}
                          >
                            Change/Assign course to Branch
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewClick(course.id)}
                            className="p-1 h-8 w-8"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(course.id)}
                            className="p-1 h-8 w-8"
                            title="Edit Course"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(course.id)}
                            className="p-1 h-8 w-8"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleEnable(course.id)}
                            className="p-1 h-8 w-8"
                          >
                            {course.enabled ? (
                              <ToggleRight className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showAssignPopup} onOpenChange={setShowAssignPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Assign course to branch
              <Button variant="ghost" size="sm" onClick={() => setShowAssignPopup(false)} className="p-1 h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select branch</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Madhapur" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select course</label>
              <Select value="Kick Boxing">
                <SelectTrigger>
                  <SelectValue placeholder="Kick Boxing" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 space-y-2">
                    {availableCourses.map((course) => (
                      <div key={course} className="flex items-center space-x-2">
                        <Checkbox
                          id={course}
                          checked={selectedCourses.includes(course)}
                          onCheckedChange={() => handleCourseToggle(course)}
                        />
                        <label htmlFor={course} className="text-sm cursor-pointer">
                          {course}
                        </label>
                      </div>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAssignNow} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Assign Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeletePopup} onOpenChange={setShowDeletePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">Are you sure you want to delete this course? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeletePopup(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
