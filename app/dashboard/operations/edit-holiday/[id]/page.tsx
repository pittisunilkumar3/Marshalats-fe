"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bell, Search, ChevronDown, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, useParams } from "next/navigation"

export default function EditHolidayPage() {
  const router = useRouter()
  const params = useParams()
  const holidayId = params.id as string

  const [formData, setFormData] = useState({
    date: "",
    day: "",
    holiday: "",
    description: "",
  })

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // Sample holiday data - in real app, this would come from API
  const holidays = [
    {
      date: "January-01",
      day: "Wednesday",
      holiday: "New Year",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "January-12",
      day: "Mon",
      holiday: "Bogi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "January-13",
      day: "January-13",
      holiday: "January-13",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "January-14",
      day: "Tue",
      holiday: "Makara sankrathis",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "January-26",
      day: "Sunday",
      holiday: "Republic Day",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "March-14",
      day: "Friday",
      holiday: "Holi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "March 30",
      day: "MON",
      holiday: "Ugadi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "april-14",
      day: "Mon",
      holiday: "Dr Ambedkar Jayanthi",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
    {
      date: "April 18",
      day: "Friday",
      holiday: "Good friday",
      description: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia for this deserunt.",
    },
  ]

  useEffect(() => {
    // Load holiday data based on ID
    const holidayIndex = Number.parseInt(holidayId)
    if (holidayIndex >= 0 && holidayIndex < holidays.length) {
      const holiday = holidays[holidayIndex]
      setFormData({
        date: holiday.date,
        day: holiday.day,
        holiday: holiday.holiday,
        description: holiday.description,
      })
    }
  }, [holidayId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Here you would typically save to API
    console.log("Saving holiday:", formData)
    setShowSuccessPopup(true)
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/operations")
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
                    <DropdownMenuItem onClick={() => router.push("/dashboard/operations")}>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Holiday</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/operations")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Operations</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-6 max-w-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  placeholder="January-01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Input
                  id="day"
                  value={formData.day}
                  onChange={(e) => handleInputChange("day", e.target.value)}
                  placeholder="Wednesday"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="holiday">Holiday Name</Label>
              <Input
                id="holiday"
                value={formData.holiday}
                onChange={(e) => handleInputChange("holiday", e.target.value)}
                placeholder="New Year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Holiday description..."
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Holiday Updated Successfully!</h3>
              <p className="text-gray-600 mb-6">The holiday information has been updated successfully.</p>
              <div className="flex justify-center space-x-3">
                <Button onClick={handleSuccessOk} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  OK
                </Button>
                <Button variant="outline" onClick={handleSuccessOk}>
                  Back to List
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
