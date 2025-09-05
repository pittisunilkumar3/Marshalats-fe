"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, Calendar, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

export default function CreateBranch() {
  const router = useRouter()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const handleCreateBranch = () => {
    setShowSuccessPopup(true)
  }

  const handlePopupClose = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/branches")
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header - Same as dashboard */}
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
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-4 text-sm whitespace-nowrap"
                >
                  Dashboard
                </button>
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

      <main className="w-full p-4 lg:p-6 overflow-x-hidden">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Branch</h1>
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <span>Add New Branch</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Branch Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Branch informaion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchName" className="text-sm font-medium">
                      Branch Name
                    </Label>
                    <Input id="branchName" placeholder="Rock martial arts" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="branchCode" className="text-sm font-medium">
                      Branch Code
                    </Label>
                    <Input id="branchCode" placeholder="RMA 01" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="branchEmail" className="text-sm font-medium">
                      Branch Email ID
                    </Label>
                    <Input id="branchEmail" placeholder="yourname@email.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="branchContact" className="text-sm font-medium">
                      Branch Contact number
                    </Label>
                    <div className="flex mt-1">
                      <Select defaultValue="+1">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+91">+91</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="345 567-23-56" className="flex-1 ml-2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address
                    </Label>
                    <Input id="address" placeholder="928#123" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="area" className="text-sm font-medium">
                      Area
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Madhapur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="madhapur">Madhapur</SelectItem>
                        <SelectItem value="hitech-city">Hitech City</SelectItem>
                        <SelectItem value="gachibowli">Gachibowli</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Input id="city" placeholder="Hyderabad" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">
                      State
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Telangana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium">
                      Zip Code/Pin Code
                    </Label>
                    <Input id="zipCode" placeholder="500089" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="India" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">USA</SelectItem>
                        <SelectItem value="uk">UK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assign to Branch */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Assign to Branch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Accessories Available this branch?</Label>
                  <RadioGroup defaultValue="yes" className="flex space-x-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Select Courses</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                      {["Taekwondo", "Karate", "Kung Fu", "Mixed Martial Arts", "Zumba Dance", "Bharath Natyam"].map(
                        (course) => (
                          <div key={course} className="flex items-center space-x-2">
                            <Checkbox id={course} />
                            <Label htmlFor={course} className="text-sm">
                              {course}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Branch admin</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded p-3">
                      {["Coach-1", "Coach-2", "Coach-3", "Coach-4", "Coach-5", "Coach-6"].map((coach) => (
                        <div key={coach} className="flex items-center space-x-2">
                          <Checkbox id={coach} />
                          <Label htmlFor={coach} className="text-sm">
                            {coach}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Branch Manager / Instructor Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Branch Manager / Instructor Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="managerName" className="text-sm font-medium">
                      Branch Manager Name
                    </Label>
                    <Input id="managerName" placeholder="Ravi Kumar" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="designation" className="text-sm font-medium">
                      Designation
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Operational Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coursesOffered" className="text-sm font-medium">
                      Courses Offerd
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Rock martial arts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="martial-arts">Rock martial arts</SelectItem>
                        <SelectItem value="karate">Karate</SelectItem>
                        <SelectItem value="taekwondo">Taekwondo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Branch Timings</Label>
                    <div className="flex space-x-2 mt-1">
                      <Select>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Input placeholder="Timings" />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Set Holiday calender</Label>
                  <div className="relative mt-1">
                    <Input placeholder="Select Dates" />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName" className="text-sm font-medium">
                      Bank Name
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="State bank of india" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sbi">State bank of india</SelectItem>
                        <SelectItem value="hdfc">HDFC Bank</SelectItem>
                        <SelectItem value="icici">ICICI Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber" className="text-sm font-medium">
                      Account number
                    </Label>
                    <Input id="accountNumber" placeholder="xxxxxxxxxxxx" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="upiId" className="text-sm font-medium">
                    UPI ID
                  </Label>
                  <Input id="upiId" placeholder="name@ybl" className="mt-1" />
                </div>
              </CardContent>
            </Card>

            {/* Create Branch Button */}
            <div className="flex justify-end">
              <Button onClick={handleCreateBranch} className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2">
                Create Branch
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Success!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-6">Branch has been created successfully!</p>
            <Button onClick={handlePopupClose} className="bg-yellow-400 hover:bg-yellow-500 text-black px-8">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
