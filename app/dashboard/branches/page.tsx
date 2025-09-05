"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, Edit, Trash2, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function BranchesList() {
  const router = useRouter()
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<number | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCoach, setSelectedCoach] = useState("")
  const [branches, setBranches] = useState([
    {
      id: "RMA01",
      name: "Madhapur Branch",
      location: "Kavuri Hills Madhapur, Hyderabad",
      activeStudents: 47,
      courses: 6,
      admin: "Ravi Krishna ch",
      masters: 10,
      accessories: "Yes",
      email: "name@email.com",
      contact: "9848XXXXXX",
      status: "Manager",
    },
    {
      id: "RMA02",
      name: "Hitech City Branch",
      location: "HITECH City, Hyderabad",
      activeStudents: 55,
      courses: 12,
      admin: "Priya Sharma",
      masters: 15,
      accessories: "Yes",
      email: "priya@email.com",
      contact: "9848YYYYYY",
      status: "Manager",
    },
    {
      id: "RMA03",
      name: "Gachibowli Branch",
      location: "Gachibowli, Hyderabad",
      activeStudents: 34,
      courses: 8,
      admin: "Amit Kumar",
      masters: 7,
      accessories: "No",
      email: "amit@email.com",
      contact: "9848ZZZZZZ",
      status: "Manager",
    },
    {
      id: "RMA01",
      name: "Madhapur Branch",
      location: "Kavuri Hills Madhapur, Hyderabad",
      activeStudents: 47,
      courses: 19,
      admin: "Ravi Krishna ch",
      masters: 10,
      accessories: "Yes",
      email: "name@email.com",
      contact: "9848XXXXXX",
      status: "Manager",
    },
    {
      id: "RMA01",
      name: "Madhapur Branch",
      location: "Kavuri Hills Madhapur, Hyderabad",
      activeStudents: 47,
      courses: 7,
      admin: "Ravi Krishna ch",
      masters: 10,
      accessories: "No",
      email: "name@email.com",
      contact: "9848XXXXXX",
      status: "Manager",
    },
    {
      id: "RMA01",
      name: "Madhapur Branch",
      location: "Kavuri Hills Madhapur, Hyderabad",
      activeStudents: 47,
      courses: 3,
      admin: "Ravi Krishna ch",
      masters: 10,
      accessories: "Yes",
      email: "name@email.com",
      contact: "9848XXXXXX",
      status: "Manager",
    },
    {
      id: "RMA01",
      name: "Madhapur Branch",
      location: "Kavuri Hills Madhapur, Hyderabad",
      activeStudents: 47,
      courses: 2,
      admin: "Ravi Krishna ch",
      masters: 10,
      accessories: "No",
      email: "name@email.com",
      contact: "9848XXXXXX",
      status: "Manager",
    },
    {
      id: "RMA01",
      name: "Madhapur Branch",
      location: "Kavuri Hills Madhapur, Hyderabad",
      activeStudents: 47,
      courses: 5,
      admin: "Ravi Krishna ch",
      masters: 10,
      accessories: "No",
      email: "name@email.com",
      contact: "9848XXXXXX",
      status: "Manager",
    },
  ])

  const handleAssign = () => {
    if (selectedBranch && selectedCoach) {
      setBranches((prev) =>
        prev.map((branch) => (branch.name === selectedBranch ? { ...branch, admin: selectedCoach } : branch)),
      )
      setSelectedBranch("")
      setSelectedCoach("")
      setShowAssignPopup(false)
    }
  }

  const handleDeleteClick = (index: number) => {
    setBranchToDelete(index)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = () => {
    if (branchToDelete !== null) {
      setBranches((prev) => prev.filter((_, index) => index !== branchToDelete))
      setShowDeletePopup(false)
      setBranchToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeletePopup(false)
    setBranchToDelete(null)
  }

  const handleEditClick = (index: number) => {
    router.push(`/dashboard/branches/edit/${index}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
                  className="text-gray-600 hover:text-gray-900 pb-4 text-sm whitespace-nowrap"
                >
                  Dashboard
                </button>
                <a
                  href="#"
                  className="text-yellow-500 font-medium border-b-2 border-yellow-500 pb-4 text-sm whitespace-nowrap"
                >
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Branches list</h1>
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6"
            onClick={() => setShowAssignPopup(true)}
          >
            Assign
          </Button>
        </div>

        <div className="mb-6">
          <Input placeholder="Search by name, ID, Location" className="max-w-sm" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.of Active students
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.of Courses
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch Admin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.of Masters
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accessories Available
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch Email Id
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map((branch, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">{branch.location}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.activeStudents}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.courses}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{branch.admin}</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1 w-fit">
                        {branch.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.masters}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.accessories}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.contact}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600" onClick={() => handleEditClick(index)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteClick(index)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Switch defaultChecked className="data-[state=checked]:bg-yellow-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button variant="outline" className="px-3 py-2 bg-transparent">
            Previous
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2">1</Button>
          <Button variant="outline" className="px-3 py-2 bg-transparent">
            2
          </Button>
          <Button variant="outline" className="px-3 py-2 bg-transparent">
            3
          </Button>
          <Button variant="outline" className="px-3 py-2 bg-transparent">
            4
          </Button>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2">Next</Button>
        </div>
      </main>

      {showAssignPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Change Branch manager</h2>
              <button onClick={() => setShowAssignPopup(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Madhapur Branch">Madhapur</SelectItem>
                    <SelectItem value="Hitech City Branch">Hitech City</SelectItem>
                    <SelectItem value="Gachibowli Branch">Gachibowli</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Coach</label>
                <Select value={selectedCoach} onValueChange={setSelectedCoach}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ravi chandran">Ravi chandran</SelectItem>
                    <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                    <SelectItem value="Amit Kumar">Amit Kumar</SelectItem>
                    <SelectItem value="Sneha Patel">Sneha Patel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAssign}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6"
                disabled={!selectedBranch || !selectedCoach}
              >
                Assign Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Delete Branch</h2>
              <button onClick={handleDeleteCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete this branch? This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleDeleteCancel} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
