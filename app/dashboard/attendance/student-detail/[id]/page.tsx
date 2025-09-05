"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"

export default function StudentAttendanceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [currentMonth, setCurrentMonth] = useState("May - 2025")

  // Sample student data based on ID
  const studentData = {
    name: "Shaolin Xiao Hong Chuan",
    studentName: "Suman",
    age: "14 years",
    gender: "Male",
    courseName: "Kung fu",
    courseDuration: "6 months",
    coach: "Mohan Kumar",
    branchLocation: "Madhapur",
    subscription: "Monthly",
    contactNumbers: "9848123456",
    dateOfJoining: "01/05/2025",
    dueDate: "01/06/2025",
    totalDays: 75,
    totalDaysPresent: 63,
    lateComings: 12,
    attendancePercentage: 86.7,
    monthlyTotalDays: 28,
    monthlyPresent: 25,
    monthlyLateComings: 2,
    monthlyPercentage: 94,
  }

  const attendanceData = [
    {
      date: "Thurs day, 1 may 2025",
      status: "Status",
      scheduled: "9 am - 6 pm",
      shift: "9 hr Shift: A",
      checkIn: "8:30 AM",
      checkOut: "5:30 PM",
      workedHours: "9 hr 00 min",
      difference: "00",
    },
    {
      date: "Thurs day, 1 may 2025",
      status: "Status",
      scheduled: "9 am - 6 pm",
      shift: "9 hr Shift: A",
      checkIn: "8:55 AM",
      checkOut: "5:00 PM",
      workedHours: "8 hr 50 min",
      difference: "-10 min",
      isLate: true,
      isEarlyOut: true,
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

        {/* Attendance Overview */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Attendance Overview</h2>
          <div className="flex gap-2">
            <Select defaultValue="2023-2024">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="annual">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Student Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="relative">
                <img
                  src="/young-martial-arts-student-practicing.jpg"
                  alt="Student"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-yellow-400 text-black font-semibold px-3 py-1">{studentData.name}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Personal Details:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student Name</span>
                      <span>{studentData.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{studentData.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender</span>
                      <span>{studentData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course Name</span>
                      <span>{studentData.courseName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course duration</span>
                      <span>{studentData.courseDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coach:</span>
                      <span>{studentData.coach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch Location:</span>
                      <span>{studentData.branchLocation}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Registration Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription:</span>
                      <span>{studentData.subscription}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact numbers</span>
                      <span>{studentData.contactNumbers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of joining</span>
                      <span>{studentData.dateOfJoining}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="text-red-500">{studentData.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{studentData.totalDays}</div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{studentData.totalDaysPresent}</div>
                  <div className="text-sm text-gray-600">Total days Present</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{studentData.lateComings}</div>
                  <div className="text-sm text-gray-600">Late Comings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{studentData.attendancePercentage}%</div>
                  <div className="text-sm text-gray-600">Attendance Percentage</div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Navigation */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth("April - 2025")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold">{currentMonth}</h3>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth("June - 2025")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Report
                </Button>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-600">Filter by:</span>
                  <Select defaultValue="jan-2025">
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan-2025">Jan 2025</SelectItem>
                      <SelectItem value="feb-2025">Feb 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="june-2025">
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="june-2025">June 2025</SelectItem>
                      <SelectItem value="july-2025">July 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Monthly Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{studentData.monthlyTotalDays}</div>
                  <div className="text-sm text-gray-600">Total Days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{studentData.monthlyPresent}</div>
                  <div className="text-sm text-gray-600">Total days Present</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{studentData.monthlyLateComings}</div>
                  <div className="text-sm text-gray-600">Late Comings</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{studentData.monthlyPercentage}%</div>
                  <div className="text-sm text-gray-600">Attendance Percentage</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Scheduled</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Check in</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Check out</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Worked hours</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">{record.date}</td>
                      <td className="py-3 px-2">{record.status}</td>
                      <td className="py-3 px-2">
                        <div>
                          <div>{record.scheduled}</div>
                          <div className="text-xs text-gray-500">{record.shift}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span>{record.checkIn}</span>
                          {record.isLate && <Badge className="bg-red-100 text-red-800 text-xs">Late Coming</Badge>}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span>{record.checkOut}</span>
                          {record.isEarlyOut && <Badge className="bg-pink-100 text-pink-800 text-xs">Early Out</Badge>}
                        </div>
                      </td>
                      <td className="py-3 px-2">{record.workedHours}</td>
                      <td className="py-3 px-2">
                        <span className={record.difference.includes("-") ? "text-red-600" : "text-gray-900"}>
                          {record.difference}
                        </span>
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
