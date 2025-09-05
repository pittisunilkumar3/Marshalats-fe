"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"

export default function ReportsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Reports" />

      <main className="w-full p-4 lg:p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and view comprehensive reports</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Student Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View attendance, performance, and enrollment reports for students</p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Revenue, payments, and financial analytics</p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Coach Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Coach performance, attendance, and ratings</p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Branch Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Branch-wise performance and analytics</p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Course Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Course enrollment and completion statistics</p>
              <Button variant="outline" className="w-full">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Custom Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and view custom reports</p>
              <Button variant="outline" className="w-full">Create Report</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Reports</CardTitle>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Monthly Attendance Report", type: "Student", date: "2024-04-28", status: "Completed" },
                { name: "Revenue Analysis Q1", type: "Financial", date: "2024-04-25", status: "Completed" },
                { name: "Coach Performance Review", type: "Coach", date: "2024-04-22", status: "Completed" },
                { name: "Branch Comparison Report", type: "Branch", date: "2024-04-20", status: "Completed" },
                { name: "Course Enrollment Trends", type: "Course", date: "2024-04-18", status: "Completed" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-600">{report.type} • {report.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">{report.status}</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
