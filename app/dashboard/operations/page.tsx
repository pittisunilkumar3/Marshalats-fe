"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, ChevronDown, MoreHorizontal, Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function OperationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("business-hours")
  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", startTime: "10:00 am", closeTime: "07:00 pm", enabled: true },
    { day: "Tuesday", startTime: "10:00 am", closeTime: "07:00 pm", enabled: true },
    { day: "Wednesday", startTime: "10:00 am", closeTime: "07:00 pm", enabled: true },
    { day: "Thursday", startTime: "10:00 am", closeTime: "07:00 pm", enabled: true },
    { day: "Friday", startTime: "10:00 am", closeTime: "07:00 pm", enabled: true },
    { day: "Saturday", startTime: "", closeTime: "", enabled: false },
    { day: "Sunday", startTime: "", closeTime: "", enabled: false },
  ])

  const [holidays, setHolidays] = useState([
    {
      date: "January-01",
      day: "Wednesday",
      holiday: "New Year",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "January-12",
      day: "Mon",
      holiday: "Bogi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "January-13",
      day: "January-13",
      holiday: "January-13",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "January-14",
      day: "Tue",
      holiday: "Makara sankrathis",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "January-26",
      day: "Sunday",
      holiday: "Republic Day",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "March-14",
      day: "Friday",
      holiday: "Holi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "March 30",
      day: "MON",
      holiday: "Ugadi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "april-14",
      day: "Mon",
      holiday: "Dr Ambedkar Jayanthi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
    {
      date: "April 18",
      day: "Friday",
      holiday: "Good friday",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
      enabled: true,
    },
  ])

  const updateBusinessHour = (index: number, field: string, value: string | boolean) => {
    const updated = [...businessHours]
    updated[index] = { ...updated[index], [field]: value }
    setBusinessHours(updated)
  }

  const deleteBusinessHour = (index: number) => {
    const updated = businessHours.filter((_, i) => i !== index)
    setBusinessHours(updated)
  }

  const updateHoliday = (index: number, field: string, value: string | boolean) => {
    const updated = [...holidays]
    updated[index] = { ...updated[index], [field]: value }
    setHolidays(updated)
  }

  const deleteHoliday = (index: number) => {
    const updated = holidays.filter((_, i) => i !== index)
    setHolidays(updated)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap cursor-pointer"
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap flex items-center space-x-1">
                      <span>Attendance</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/attendance/students")}>
                      Dashboard
                    </DropdownMenuItem>
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
                    <DropdownMenuItem onClick={() => router.push("/dashboard/payment-tracking")}>
                      Payment Tracking
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="text-yellow-500 font-medium">Operations</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* Main Content */}
      <main className="w-full p-4 lg:p-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab("business-hours")}
            className={
              activeTab === "business-hours"
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          >
            Branch business hours
          </Button>
          <Button
            onClick={() => setActiveTab("holiday-list")}
            className={
              activeTab === "holiday-list"
                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          >
            Branch Holiday List
          </Button>
        </div>

        {/* Business Hours Tab */}
        {activeTab === "business-hours" && (
          <div className="space-y-6">
            {businessHours.map((hour, index) => (
              <div key={hour.day} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 w-24">{hour.day}</h3>
                  <div className="flex items-center space-x-4 flex-1">
                    {hour.enabled ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Start Time</span>
                          <Input
                            value={hour.startTime}
                            onChange={(e) => updateBusinessHour(index, "startTime", e.target.value)}
                            className="w-32"
                            placeholder="10:00 am"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Close Time</span>
                          <Input
                            value={hour.closeTime}
                            onChange={(e) => updateBusinessHour(index, "closeTime", e.target.value)}
                            className="w-32"
                            placeholder="07:00 pm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBusinessHour(index)}
                          className="p-1 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1"></div>
                    )}
                    <Switch
                      checked={hour.enabled}
                      onCheckedChange={(checked) => updateBusinessHour(index, "enabled", checked)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Holiday List Tab */}
        {activeTab === "holiday-list" && (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monday
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monday
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monday
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {holidays.map((holiday, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holiday.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holiday.day}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{holiday.holiday}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md">{holiday.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-8 w-8"
                            onClick={() => router.push(`/dashboard/operations/edit-holiday/${index}`)}
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteHoliday(index)}
                            className="p-1 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Switch
                            checked={holiday.enabled}
                            onCheckedChange={(checked) => updateHoliday(index, "enabled", checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-gray-500 bg-transparent">
                  Previous
                </Button>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" size="sm">
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
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
