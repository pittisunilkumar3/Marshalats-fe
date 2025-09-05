"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, Download, MessageCircle, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function PaymentTrackingPage() {
  const router = useRouter()

  const paymentData = [
    {
      id: 1,
      studentName: "Hari Krishna. S",
      course: "Kugnfu, Shilambam Zumba",
      invoiceAmount: "₹18490",
      paidAmount: "₹6490",
      dueAmount: "₹12000",
      paymentDate: "01 / 05 / 2025",
      description: "Done by offline payment",
      status: "Payment due",
    },
    {
      id: 2,
      studentName: "Hari Krishna. S",
      course: "Kugnfu, Shilambam Zumba",
      invoiceAmount: "₹18490",
      paidAmount: "₹6490",
      dueAmount: "₹12000",
      paymentDate: "01 / 05 / 2025",
      description: "Done by offline payment",
      status: "No payment due",
    },
    {
      id: 3,
      studentName: "Hari Krishna. S",
      course: "Kugnfu, Shilambam Zumba",
      invoiceAmount: "₹18490",
      paidAmount: "₹6490",
      dueAmount: "₹12000",
      paymentDate: "01 / 05 / 2025",
      description: "Done by offline payment",
      status: "Payment due",
    },
    {
      id: 4,
      studentName: "Hari Krishna. S",
      course: "Kugnfu, Shilambam Zumba",
      invoiceAmount: "₹18490",
      paidAmount: "₹6490",
      dueAmount: "₹12000",
      paymentDate: "01 / 05 / 2025",
      description: "Done by offline payment",
      status: "No payment due",
    },
    {
      id: 5,
      studentName: "Hari Krishna. S",
      course: "Kugnfu, Shilambam Zumba",
      invoiceAmount: "₹18490",
      paidAmount: "₹6490",
      dueAmount: "₹12000",
      paymentDate: "01 / 05 / 2025",
      description: "Done by offline payment",
      status: "No payment due",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <button className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap flex items-center space-x-1">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Payment Tracking</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      <main className="w-full p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Tracking</h1>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="madhapur">Madhapur</SelectItem>
              <SelectItem value="hitech">Hitech City</SelectItem>
              <SelectItem value="gachibowli">Gachibowli</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-green-500 hover:bg-green-600 text-white">Send payment alerts</Button>

          <Button className="bg-purple-500 hover:bg-purple-600 text-white">Export Report</Button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">View by:</span>
            <Select defaultValue="weekly">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-gray-600">Filter by:</span>
            <Select defaultValue="jan-2025">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan-2025">Jan 2025</SelectItem>
                <SelectItem value="feb-2025">Feb 2025</SelectItem>
                <SelectItem value="mar-2025">Mar 2025</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="april-2025">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="april-2025">April 2025</SelectItem>
                <SelectItem value="may-2025">May 2025</SelectItem>
                <SelectItem value="june-2025">June 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course enrolled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Alerts
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentData.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.invoiceAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paidAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.dueAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={
                        payment.status === "Payment due" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Download className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
