"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Search, ChevronDown, MoreHorizontal, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, useParams } from "next/navigation"

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [courseTitle, setCourseTitle] = useState("")
  const [martialArtsStyle, setMartialArtsStyle] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState("")
  const [category, setCategory] = useState("")
  const [branchPrice, setBranchPrice] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const sampleCourses = [
    {
      id: "1",
      title: "Kung fu",
      style: "Karate, BJJ, Muay Thai, etc.",
      difficulty: "entry level",
      category: "Beginner/Intermediate/Expert",
      price: "INR 8500",
    },
    {
      id: "2",
      title: "Taekwondo",
      style: "Traditional Korean Martial Art",
      difficulty: "intermediate level",
      category: "Intermediate/Expert",
      price: "INR 9000",
    },
    {
      id: "3",
      title: "Kick Boxing",
      style: "Western Boxing with Kicks",
      difficulty: "advanced level",
      category: "Expert",
      price: "INR 7500",
    },
  ]

  useEffect(() => {
    const course = sampleCourses.find((c) => c.id === courseId)
    if (course) {
      setCourseTitle(course.title)
      setMartialArtsStyle(course.style)
      setDifficultyLevel(course.difficulty)
      setCategory(course.category)
      setBranchPrice(course.price)
    }
  }, [courseId])

  const handleSaveChanges = () => {
    console.log("Saving course changes:", {
      courseTitle,
      martialArtsStyle,
      difficultyLevel,
      category,
      branchPrice,
    })
    setShowSuccessPopup(true)
  }

  const handleSuccessOk = () => {
    setShowSuccessPopup(false)
    router.push("/dashboard/courses")
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/courses")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course List</span>
          </Button>
        </div>

        <Card className="max-w-4xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courseTitle">Course Title</Label>
                <Select value={courseTitle} onValueChange={setCourseTitle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kung fu">Kung fu</SelectItem>
                    <SelectItem value="Taekwondo">Taekwondo</SelectItem>
                    <SelectItem value="Kick Boxing">Kick Boxing</SelectItem>
                    <SelectItem value="Karate">Karate</SelectItem>
                    <SelectItem value="Judo">Judo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="martialArtsStyle">Martial Arts Style</Label>
                <Select value={martialArtsStyle} onValueChange={setMartialArtsStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select martial arts style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Karate, BJJ, Muay Thai, etc.">Karate, BJJ, Muay Thai, etc.</SelectItem>
                    <SelectItem value="Traditional Korean Martial Art">Traditional Korean Martial Art</SelectItem>
                    <SelectItem value="Western Boxing with Kicks">Western Boxing with Kicks</SelectItem>
                    <SelectItem value="Japanese Martial Art">Japanese Martial Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry level">Entry level</SelectItem>
                    <SelectItem value="intermediate level">Intermediate level</SelectItem>
                    <SelectItem value="advanced level">Advanced level</SelectItem>
                    <SelectItem value="expert level">Expert level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner/Intermediate/Expert">Beginner/Intermediate/Expert</SelectItem>
                    <SelectItem value="Intermediate/Expert">Intermediate/Expert</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="branchPrice">Branch Specific Price</Label>
                <Select value={branchPrice} onValueChange={setBranchPrice}>
                  <SelectTrigger className="md:w-1/2">
                    <SelectValue placeholder="Select price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR 8500">INR 8500</SelectItem>
                    <SelectItem value="INR 9000">INR 9000</SelectItem>
                    <SelectItem value="INR 7500">INR 7500</SelectItem>
                    <SelectItem value="INR 10000">INR 10000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8">
              <Button onClick={handleSaveChanges} className="bg-yellow-400 hover:bg-yellow-500 text-black px-8">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Success!</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-gray-600">Course has been updated successfully!</p>
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={handleSuccessOk} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              OK
            </Button>
            <Button variant="outline" onClick={handleSuccessOk}>
              Back to List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
