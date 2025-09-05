"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Search, ChevronDown, MoreHorizontal, Edit, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function CourseListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showBranchDropdown, setShowBranchDropdown] = useState<number | null>(null)
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null)
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "SHAOLIN KUNG FU",
      icon: "🥋",
      branches: 5,
      masters: 2,
      students: 25,
      enabled: true,
      branchLocations: ["Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka", "Madhapur"],
    },
    {
      id: 2,
      name: "TAEKWONDO",
      icon: "🥋",
      branches: 5,
      masters: 2,
      students: 25,
      enabled: true,
      branchLocations: ["Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka", "Madhapur"],
    },
    {
      id: 3,
      name: "KICK BOXING",
      icon: "🥊",
      branches: 5,
      masters: 1,
      students: 25,
      enabled: true,
      branchLocations: ["Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka", "Madhapur"],
    },
    {
      id: 4,
      name: "KUCHIPUDI DANCE",
      icon: "💃",
      branches: 5,
      masters: 1,
      students: 25,
      enabled: true,
      branchLocations: ["Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka", "Madhapur"],
    },
    {
      id: 5,
      name: "GYMNASTICS",
      icon: "🤸",
      branches: 5,
      masters: 1,
      students: 25,
      enabled: true,
      branchLocations: ["Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka", "Madhapur"],
    },
    {
      id: 6,
      name: "SELF DEFENSE",
      icon: "🛡️",
      branches: 5,
      masters: 1,
      students: 25,
      enabled: true,
      branchLocations: ["Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka", "Madhapur"],
    },
  ])

  const availableCourses = ["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"]

  const branches = ["Madhapur", "Balaji Nagar", "Malkajgiri", "Yapral", "Tarnaka"]

  const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))

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

  const handleEditClick = (courseId: number) => {
    router.push(`/dashboard/courses/edit/${courseId}`)
  }

  const handleDeleteClick = (courseId: number) => {
    setCourseToDelete(courseId)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      setCourses((prev) => prev.filter((course) => course.id !== courseToDelete))
      setShowDeletePopup(false)
      setCourseToDelete(null)
    }
  }

  const handleToggleEnable = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === courseId ? { ...course, enabled: !course.enabled } : course)),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8 min-w-0">
              <div className="flex items-center flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">ROCK</span>
                </div>
              </div>

              <nav className="hidden md:flex space-x-3 lg:space-x-6 overflow-x-auto">
                <a
                  href="#"
                  onClick={() => router.push("/dashboard")}
                  className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-4 text-sm whitespace-nowrap cursor-pointer"
                >
                  Dashboard
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Branches
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Masters
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Students
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Member ship
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Revenue
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Attendance
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Reports
                </a>
                <MoreHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </nav>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Try searching: User Name, Course Name, User ID"
                  className="pl-10 w-64 xl:w-80 bg-gray-50"
                />
              </div>

              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline">Super admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course list</h1>
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
                            onClick={() => handleEditClick(course.id)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(course.id)}
                            className="p-1 h-8 w-8"
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
