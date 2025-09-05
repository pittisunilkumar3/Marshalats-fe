"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, BookOpen } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardHeader from "@/components/dashboard-header"

import { useRouter } from "next/navigation"

export default function SuperAdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Dashboard" />

      <main className="w-full p-4 lg:p-6">
        {/* Dashboard Header with Action Buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm">Assign</Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent text-sm"
              onClick={() => router.push("/dashboard/create-student")}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Add new student</span>
              <span className="sm:hidden">Student</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent text-sm"
              onClick={() => router.push("/dashboard/create-course")}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Add Course</span>
              <span className="sm:hidden">Course</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent text-sm"
              onClick={() => router.push("/dashboard/add-coach")}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Add Coach</span>
              <span className="sm:hidden">Coach</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent text-sm"
              onClick={() => router.push("/dashboard/create-branch")}
            >
              <span className="hidden sm:inline">Add New Branch</span>
              <span className="sm:hidden">Branch</span>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">$46.34k</p>
                  <p className="text-xs text-gray-500">Earning this month</p>
                </div>
                <Badge variant="secondary" className="bg-gray-100">
                  Monthly
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold">370</p>
                  <p className="text-xs text-gray-500">Active users this month</p>
                </div>
                <Badge variant="secondary" className="bg-gray-100">
                  Monthly
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold">10+</p>
                  <p className="text-xs text-gray-500">Active courses in all branches</p>
                </div>
                <Badge variant="secondary" className="bg-gray-100">
                  Most popular
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Number of Users</p>
                  <p className="text-2xl font-bold">800+</p>
                  <p className="text-xs text-gray-500">Total no of orders</p>
                </div>
                <Badge variant="secondary" className="bg-gray-100">
                  NEW
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart and Coaches List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Revenue</CardTitle>
                <div className="flex items-center space-x-4">
                  <Button variant="link" className="text-blue-600">
                    View Report
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Select defaultValue="all-branches">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-branches">All Branches</SelectItem>
                        <SelectItem value="branch-1">Branch 1</SelectItem>
                        <SelectItem value="branch-2">Branch 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Revenue Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>

          {/* List of Coaches */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>List of coaches</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Filter by:</span>
                  <Select defaultValue="branch">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="branch">BRANCH</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Emily Tyler", specialty: "Bharathanatayam", rating: 5 },
                  { name: "Blake Silva", specialty: "Kick boxing", rating: 5 },
                  { name: "Oscar Holloway", specialty: "Kungfu", rating: 5 },
                  { name: "Shawn Stone", specialty: "Kungfu", rating: 4.5 },
                  { name: "Wayne Marsh", specialty: "Boxing", rating: 4.5 },
                ].map((coach, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {coach.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{coach.name}</p>
                        <p className="text-xs text-gray-500">{coach.specialty}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(coach.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Attendance and Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Attendance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex space-x-4">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">Student Attendance</Button>
                <Button variant="outline">Master Attendance</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-semibold">Student Attendance</h3>
                <div className="flex items-center space-x-4">
                  <Select defaultValue="march">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="march">Select Month: March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="today">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Sort BY: Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Student Name</th>
                      <th className="text-left py-2">Gender</th>
                      <th className="text-left py-2">Expertise</th>
                      <th className="text-left py-2">Emil Id</th>
                      <th className="text-left py-2">Date of Join</th>
                      <th className="text-left py-2">Check In</th>
                      <th className="text-left py-2">Check out</th>
                      <th className="text-left py-2">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">25/04/2025</td>
                        <td className="py-2">Abhi ram</td>
                        <td className="py-2">Male</td>
                        <td className="py-2">Martial Arts</td>
                        <td className="py-2">Abhi@gmail.com</td>
                        <td className="py-2">25/04/2025</td>
                        <td className="py-2">06:30 AM</td>
                        <td className="py-2">09:00 AM</td>
                        <td className="py-2">
                          <div className="flex items-center space-x-2">
                            <span>90%</span>
                            <Badge className="bg-yellow-100 text-yellow-800">View more</Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center items-center space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
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
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent payments</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Select:</span>
                  <Select defaultValue="branch">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="branch">Branch</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "RMA00A132", date: "25/04/2025", amount: "₹3500", type: "Cash" },
                  { id: "RMA00K084", date: "25/04/2025", amount: "₹4500", type: "Online" },
                  { id: "RMA06289", date: "25/04/2025", amount: "₹2300", type: "Online" },
                  { id: "RMA00C34", date: "25/04/2025", amount: "₹5500", type: "Online" },
                  { id: "RMA00A132", date: "25/04/2025", amount: "₹2900", type: "Cash" },
                ].map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{payment.id}</p>
                      <p className="text-xs text-gray-500">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{payment.amount}</p>
                      <Badge
                        variant={payment.type === "Cash" ? "secondary" : "default"}
                        className={payment.type === "Cash" ? "bg-gray-100" : "bg-blue-100 text-blue-800"}
                      >
                        {payment.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
