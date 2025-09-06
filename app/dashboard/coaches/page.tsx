"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"

export default function CoachesListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null)
  const [assignData, setAssignData] = useState({ branch: "", coach: "" })

  const branchOptions = ["Madhapur", "Hitech City", "Gachibowli", "Kondapur", "Kukatpally"]

  const coachOptions = ["Ravi Chandran", "Sneha Sharma", "Rajesh Kumar", "Amitabh Singh", "Priya Verma", "Vijay Patel"]

  const [coaches, setCoaches] = useState([
    {
      id: 1,
      name: "Ravi Chandran",
      gender: "Male",
      age: 32,
      designation: "Sensei",
      experience: "5+ years",
      expertise: ["Taekwondo", "Kung Fu", "Karate", "Mixed Martial Arts", "Bharath Natyam", "Zumba Dance"],
      email: "ravi@email.com",
      phone: "9848XXXXXX",
      isActive: true,
    },
    {
      id: 2,
      name: "Sneha Sharma",
      gender: "Female",
      age: 28,
      designation: "Grandmaster",
      experience: "5+ years",
      expertise: ["Taekwondo", "Kung Fu", "Karate", "Mixed Martial Arts", "Bharath Natyam", "Zumba Dance"],
      email: "sneha@email.com",
      phone: "9848XXXXXX",
      isActive: true,
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      gender: "Male",
      age: 35,
      designation: "Dojo-cho",
      experience: "5+ years",
      expertise: ["Taekwondo", "Kung Fu", "Karate", "Mixed Martial Arts", "Bharath Natyam", "Zumba Dance"],
      email: "rajesh@email.com",
      phone: "9848XXXXXX",
      isActive: true,
    },
    {
      id: 4,
      name: "Amitabh Singh",
      gender: "Male",
      age: 30,
      designation: "Grandmaster",
      experience: "5+ years",
      expertise: ["Taekwondo", "Kung Fu", "Karate", "Mixed Martial Arts", "Bharath Natyam", "Zumba Dance"],
      email: "amitabh@email.com",
      phone: "9848XXXXXX",
      isActive: true,
    },
    {
      id: 5,
      name: "Priya Verma",
      gender: "Female",
      age: 29,
      designation: "Dojo-cho",
      experience: "5+ years",
      expertise: ["Taekwondo", "Kung Fu", "Karate", "Mixed Martial Arts", "Bharath Natyam", "Zumba Dance"],
      email: "priya@email.com",
      phone: "9848XXXXXX",
      isActive: true,
    },
    {
      id: 6,
      name: "Vijay Patel",
      gender: "Male",
      age: 37,
      designation: "Shihan",
      experience: "5+ years",
      expertise: ["Taekwondo", "Kung Fu", "Karate", "Mixed Martial Arts", "Bharath Natyam", "Zumba Dance"],
      email: "vijay@email.com",
      phone: "9848XXXXXX",
      isActive: true,
    },
  ])

  const handleAssignClick = () => {
    setShowAssignPopup(true)
  }

  const handleAssignSubmit = () => {
    // Handle assignment logic here
    setShowAssignPopup(false)
    setAssignData({ branch: "", coach: "" })
  }

  const handleDeleteClick = (index: number) => {
    setSelectedCoach(index)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedCoach !== null) {
      setCoaches(coaches.filter((_, index) => index !== selectedCoach))
      setShowDeletePopup(false)
      setSelectedCoach(null)
    }
  }

  const handleEditClick = (index: number) => {
    router.push(`/dashboard/coaches/edit/${index}`)
  }

  const toggleCoachStatus = (index: number) => {
    setCoaches(coaches.map((coach, i) => (i === index ? { ...coach, isActive: !coach.isActive } : coach)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Coaches" />

      <main className="w-full p-4 lg:p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coach list</h1>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push("/dashboard/add-coach")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
            >
              + Add Coach
            </Button>
            <Button
              onClick={handleAssignClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              Assign Manager
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search by name, ID, location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Coaches Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Coach Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Gender</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Age</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Designation</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Experience</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Expertise</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Email Id</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Phone Number</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach, index) => (
                    <tr key={coach.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 text-blue-600">{coach.name}</td>
                      <td className="py-4 px-6 capitalize">{coach.gender}</td>
                      <td className="py-4 px-6">{coach.age}</td>
                      <td className="py-4 px-6">{coach.designation}</td>
                      <td className="py-4 px-6">{coach.experience}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {coach.expertise.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-blue-600">{coach.email}</td>
                      <td className="py-4 px-6">{coach.phone}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(index)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(index)}
                            className="p-1 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCoachStatus(index)}
                            className="p-1 h-8 w-8"
                          >
                            {coach.isActive ? (
                              <ToggleRight className="w-4 h-4 text-green-600" />
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

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 py-4 border-t">
              <Button variant="outline" size="sm" className="bg-gray-200">
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
          </CardContent>
        </Card>
      </main>

      {/* Assign Popup */}
      {showAssignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Branch manager</h3>
              <Button variant="ghost" onClick={() => setShowAssignPopup(false)} className="p-1">
                <span className="text-xl">&times;</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select branch</label>
                <Select
                  value={assignData.branch}
                  onValueChange={(value) => setAssignData({ ...assignData, branch: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Madhapur" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchOptions.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Coach</label>
                <Select
                  value={assignData.coach}
                  onValueChange={(value) => setAssignData({ ...assignData, coach: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ravi chandran" />
                  </SelectTrigger>
                  <SelectContent>
                    {coachOptions.map((coach) => (
                      <SelectItem key={coach} value={coach}>
                        {coach}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Assign Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Coach</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this coach? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowDeletePopup(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white flex-1">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
