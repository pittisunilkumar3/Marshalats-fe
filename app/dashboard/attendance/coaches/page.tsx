"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, MessageCircle, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CoachAttendancePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("master")

  // Sample coach attendance data
  const coachAttendanceData = [
    {
      date: "28/04/2025",
      coachName: "Abhi ram",
      gender: "Male",
      expertise: "Martial Arts",
      email: "Abhi@gmail.com",
      dateOfJoin: "20/04/2025",
      checkIn: "06:30 AM",
      checkOut: "09:00 AM",
      attendance: "90%",
    },
    // Repeat for multiple entries
    ...Array(10)
      .fill(null)
      .map((_, index) => ({
        date: "28/04/2025",
        coachName: "Abhi ram",
        gender: "Male",
        expertise: "Martial Arts",
        email: "Abhi@gmail.com",
        dateOfJoin: "20/04/2025",
        checkIn: "06:30 AM",
        checkOut: "09:00 AM",
        attendance: "90%",
      })),
  ]

  const studentAttendanceData = [
    {
      date: "28/04/2025",
      studentName: "Krishna Kumar Jit",
      gender: "Male",
      expertise: "Martial Arts",
      email: "krishna@gmail.com",
      dateOfJoin: "20/04/2025",
      checkIn: "06:30 AM",
      checkOut: "09:00 AM",
      attendance: "90%",
      notes: "Double punch",
    },
    {
      date: "28/04/2025",
      studentName: "Arun K",
      gender: "Female",
      expertise: "Martial Arts",
      email: "arun@gmail.com",
      dateOfJoin: "20/04/2025",
      checkIn: "06:30 AM",
      checkOut: "09:00 AM",
      attendance: "85%",
      notes: "Missed punch",
    },
    {
      date: "28/04/2025",
      studentName: "Priya Sharma",
      gender: "Female",
      expertise: "Karate",
      email: "priya@gmail.com",
      dateOfJoin: "15/04/2025",
      checkIn: "07:00 AM",
      checkOut: "09:30 AM",
      attendance: "95%",
      notes: "Perfect form",
    },
    {
      date: "28/04/2025",
      studentName: "Raj Patel",
      gender: "Male",
      expertise: "Taekwondo",
      email: "raj@gmail.com",
      dateOfJoin: "18/04/2025",
      checkIn: "06:45 AM",
      checkOut: "09:15 AM",
      attendance: "88%",
      notes: "Good progress",
    },
    {
      date: "28/04/2025",
      studentName: "Sneha Reddy",
      gender: "Female",
      expertise: "Kung Fu",
      email: "sneha@gmail.com",
      dateOfJoin: "22/04/2025",
      checkIn: "06:30 AM",
      checkOut: "09:00 AM",
      attendance: "92%",
      notes: "Excellent technique",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-4 lg:space-x-8 min-w-0">
              <div className="flex items-center flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">ROCK</span>
                </div>
              </div>

              <nav className="hidden md:flex space-x-3 lg:space-x-6 overflow-x-auto">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-4 text-sm whitespace-nowrap flex items-center space-x-1">
                      <span>Attendance</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/attendance/coaches")}>
                      Attendance data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <a href="#" className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap">
                  Reports
                </a>
                <MoreHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </nav>
            </div>

            {/* Search and User Controls */}
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

      <main className="w-full p-4 lg:p-6 overflow-x-hidden">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm">Send Alerts</Button>
            <Button variant="outline" className="text-sm bg-transparent">
              View Report
            </Button>
            <Button variant="outline" className="text-sm flex items-center space-x-2 bg-transparent">
              <span>📥</span>
              <span>Download attendance sheet</span>
            </Button>
          </div>
        </div>

        {/* Attendance Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              onClick={() => setActiveTab("student")}
              className={
                activeTab === "student"
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            >
              Student Attendance
            </Button>
            <Button
              onClick={() => setActiveTab("master")}
              className={
                activeTab === "master"
                  ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            >
              Master Attendance
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Section Header with Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold">
                {activeTab === "student" ? "Student Attendance" : "Master Attendance"}
              </h2>
              <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Branch:</span>
                  <Select defaultValue="select-branch">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select-branch">Select branch</SelectItem>
                      <SelectItem value="madhapur">Madhapur</SelectItem>
                      <SelectItem value="hitech">Hitech City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Select Month:</span>
                  <Select defaultValue="april">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort By:</span>
                  <Select defaultValue="today">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">
                      {activeTab === "student" ? "Student Name" : "Coach Name"}
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Gender</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Expertise</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Email Id</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Date of join</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Check in</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Check out</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Attendance</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">
                      {activeTab === "student" ? "Notes" : "Alerts"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "student"
                    ? studentAttendanceData.map((student, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">{student.date}</td>
                          <td className="py-3 px-2">{student.studentName}</td>
                          <td className="py-3 px-2">{student.gender}</td>
                          <td className="py-3 px-2">{student.expertise}</td>
                          <td className="py-3 px-2">{student.email}</td>
                          <td className="py-3 px-2">{student.dateOfJoin}</td>
                          <td className="py-3 px-2">{student.checkIn}</td>
                          <td className="py-3 px-2">{student.checkOut}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-2">
                              <span>{student.attendance}</span>
                              <Badge
                                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer"
                                onClick={() => router.push(`/dashboard/attendance/student-detail/${index}`)}
                              >
                                View more
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                student.notes === "Double punch" ||
                                student.notes === "Perfect form" ||
                                student.notes === "Excellent technique"
                                  ? "bg-green-100 text-green-800"
                                  : student.notes === "Missed punch"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {student.notes}
                            </span>
                          </td>
                        </tr>
                      ))
                    : coachAttendanceData.map((coach, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">{coach.date}</td>
                          <td className="py-3 px-2">{coach.coachName}</td>
                          <td className="py-3 px-2">{coach.gender}</td>
                          <td className="py-3 px-2">{coach.expertise}</td>
                          <td className="py-3 px-2">{coach.email}</td>
                          <td className="py-3 px-2">{coach.dateOfJoin}</td>
                          <td className="py-3 px-2">{coach.checkIn}</td>
                          <td className="py-3 px-2">{coach.checkOut}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-2">
                              <span>{coach.attendance}</span>
                              <Badge
                                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer"
                                onClick={() => router.push(`/dashboard/attendance/coach-detail/${index}`)}
                              >
                                View more
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                <MessageCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-xs text-gray-500">WhatsApp</span>
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <Phone className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-xs text-gray-500">SMS</span>
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
    </div>
  )
}
