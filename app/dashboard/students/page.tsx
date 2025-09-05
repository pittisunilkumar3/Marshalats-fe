"use client"

import { useState } from "react"
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

export default function StudentList() {
  const router = useRouter()
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Madhapur Branch",
      gender: "Male",
      age: 22,
      courses: ["Taekwondo", "Kung Fu", "Karate"],
      level: "Entry Level",
      duration: "5+ years",
      email: "name@gmail.com",
      phone: "9848XXXXXX",
      enabled: true,
    },
    {
      id: 2,
      name: "Madhapur Branch",
      gender: "Female",
      age: 25,
      courses: ["Taekwondo", "Kung Fu", "Karate"],
      level: "Intermediate",
      duration: "5+ years",
      email: "name@gmail.com",
      phone: "9848XXXXXX",
      enabled: true,
    },
    {
      id: 3,
      name: "Madhapur Branch",
      gender: "male",
      age: 35,
      courses: ["Taekwondo", "Kung Fu", "Karate"],
      level: "Advance",
      duration: "5+ years",
      email: "name@gmail.com",
      phone: "9848XXXXXX",
      enabled: true,
    },
    {
      id: 4,
      name: "Madhapur Branch",
      gender: "male",
      age: 30,
      courses: ["Taekwondo", "Kung Fu", "Karate"],
      level: "Intermediate",
      duration: "5+ years",
      email: "name@gmail.com",
      phone: "9848XXXXXX",
      enabled: false,
    },
    {
      id: 5,
      name: "Madhapur Branch",
      gender: "male",
      age: 29,
      courses: ["Taekwondo", "Kung Fu", "Karate"],
      level: "Advance",
      duration: "5+ years",
      email: "name@gmail.com",
      phone: "9848XXXXXX",
      enabled: true,
    },
    {
      id: 6,
      name: "Madhapur Branch",
      gender: "male",
      age: 37,
      courses: ["Taekwondo", "Kung Fu", "Karate"],
      level: "Entry Level",
      duration: "5+ years",
      email: "name@gmail.com",
      phone: "9848XXXXXX",
      enabled: true,
    },
  ])

  const handleAssignClick = () => {
    setShowAssignPopup(true)
  }

  const handleAssignConfirm = () => {
    setShowAssignPopup(false)
    setSelectedBranch("")
    setSelectedCourses([])
  }

  const handleDeleteClick = (studentId: number) => {
    setStudentToDelete(studentId)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = () => {
    if (studentToDelete !== null) {
      setStudents(students.filter((student) => student.id !== studentToDelete))
      setStudentToDelete(null)
    }
    setShowDeletePopup(false)
  }

  const handleDeleteCancel = () => {
    setStudentToDelete(null)
    setShowDeletePopup(false)
  }

  const handleEditClick = (studentId: number) => {
    router.push(`/dashboard/students/edit/${studentId}`)
  }

  const handleToggleStudent = (studentId: number) => {
    setStudents(
      students.map((student) => (student.id === studentId ? { ...student, enabled: !student.enabled } : student)),
    )
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
          <Button onClick={handleAssignClick} className="bg-yellow-400 hover:bg-yellow-500 text-black">
            Assign
          </Button>
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
                {students.map((student, index) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">{student.name}</td>
                    <td className="py-4 px-6 capitalize">{student.gender}</td>
                    <td className="py-4 px-6">{student.age}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {student.courses.map((course, courseIndex) => (
                          <Badge key={courseIndex} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">{student.level}</td>
                    <td className="py-4 px-6">{student.duration}</td>
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
                          checked={student.enabled}
                          onCheckedChange={() => handleToggleStudent(student.id)}
                          className="data-[state=checked]:bg-yellow-400"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
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
