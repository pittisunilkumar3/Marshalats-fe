"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, ToggleLeft, ToggleRight, Eye, Mail, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"
import { useToast } from "@/hooks/use-toast"

interface Coach {
  id: string
  personal_info: {
    first_name: string
    last_name: string
    gender: string
    date_of_birth: string
  }
  contact_info: {
    email: string
    phone: string
  }
  professional_info: {
    designation_id: string
    education_qualification: string
    professional_experience: string
    certifications: string[]
  }
  areas_of_expertise: string[]
  full_name: string
  is_active: boolean
  created_at: string
}

export default function CoachesListPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showSendCredentialsPopup, setShowSendCredentialsPopup] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null)
  const [selectedCoachForCredentials, setSelectedCoachForCredentials] = useState<Coach | null>(null)
  const [isSendingCredentials, setIsSendingCredentials] = useState(false)
  const [assignData, setAssignData] = useState({ branch: "", coach: "" })
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const branchOptions = ["Madhapur", "Hitech City", "Gachibowli", "Kondapur", "Kukatpally"]

  // Fetch coaches from API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to fetch coaches (${response.status})`)
        }

        const data = await response.json()
        console.log("Coaches fetched successfully:", data)

        // Handle different response formats
        const coachesData = data.coaches || data || []
        setCoaches(coachesData)

      } catch (error) {
        console.error("Error fetching coaches:", error)
        setError(error instanceof Error ? error.message : 'Failed to fetch coaches')
      } finally {
        setLoading(false)
      }
    }

    fetchCoaches()
  }, [])

  const handleAssignClick = () => {
    setShowAssignPopup(true)
  }

  const handleAssignSubmit = () => {
    // Handle assignment logic here
    setShowAssignPopup(false)
    setAssignData({ branch: "", coach: "" })
  }

  const handleDeleteClick = (coachId: string) => {
    setSelectedCoach(coachId)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedCoach !== null) {
      try {
        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${selectedCoach}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to delete coach (${response.status})`)
        }

        // Remove coach from local state
        setCoaches(coaches.filter(coach => coach.id !== selectedCoach))
        setShowDeletePopup(false)
        setSelectedCoach(null)

      } catch (error) {
        console.error("Error deleting coach:", error)
        alert(`Error deleting coach: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleViewClick = (coachId: string) => {
    router.push(`/dashboard/coaches/${coachId}`)
  }

  const handleEditClick = (coachId: string) => {
    router.push(`/dashboard/coaches/edit/${coachId}`)
  }

  const handleSendCredentialsClick = (coach: Coach) => {
    setSelectedCoachForCredentials(coach)
    setShowSendCredentialsPopup(true)
  }

  const handleSendCredentialsConfirm = async () => {
    if (!selectedCoachForCredentials) return

    setIsSendingCredentials(true)
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${selectedCoachForCredentials.id}/send-credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || `Failed to send credentials (${response.status})`)
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: `Login credentials have been sent to ${selectedCoachForCredentials.contact_info.email}`,
      })

      setShowSendCredentialsPopup(false)
      setSelectedCoachForCredentials(null)

    } catch (error) {
      console.error("Error sending credentials:", error)
      toast({
        title: "Error",
        description: `Failed to send credentials: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setIsSendingCredentials(false)
    }
  }

  const toggleCoachStatus = async (coachId: string) => {
    try {
      const token = TokenManager.getToken()
      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      const coach = coaches.find(c => c.id === coachId)
      if (!coach) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/coaches/${coachId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !coach.is_active
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.message || `Failed to update coach status (${response.status})`)
      }

      // Update local state
      setCoaches(coaches.map(c =>
        c.id === coachId ? { ...c, is_active: !c.is_active } : c
      ))

    } catch (error) {
      console.error("Error updating coach status:", error)
      alert(`Error updating coach status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
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
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-8 px-6 text-center text-gray-500">
                        Loading coaches...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={9} className="py-8 px-6 text-center text-red-500">
                        Error: {error}
                      </td>
                    </tr>
                  ) : coaches.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 px-6 text-center text-gray-500">
                        No coaches found
                      </td>
                    </tr>
                  ) : (
                    coaches.map((coach) => (
                      <tr key={coach.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 text-blue-600">{coach.full_name}</td>
                        <td className="py-4 px-6 capitalize">{coach.personal_info.gender}</td>
                        <td className="py-4 px-6">
                          {coach.personal_info.date_of_birth ?
                            new Date().getFullYear() - new Date(coach.personal_info.date_of_birth).getFullYear()
                            : 'N/A'
                          }
                        </td>
                        <td className="py-4 px-6">{coach.professional_info.designation_id}</td>
                        <td className="py-4 px-6">{coach.professional_info.professional_experience}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {coach.areas_of_expertise.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-blue-600">{coach.contact_info.email}</td>
                        <td className="py-4 px-6">{coach.contact_info.phone}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewClick(coach.id)}
                              className="p-1 h-8 w-8"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(coach.id)}
                              className="p-1 h-8 w-8"
                              title="Edit Coach"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendCredentialsClick(coach)}
                              className="p-1 h-8 w-8"
                              title="Send Credentials via Email"
                            >
                              <Mail className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(coach.id)}
                              className="p-1 h-8 w-8"
                              title="Delete Coach"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCoachStatus(coach.id)}
                              className="p-1 h-8 w-8"
                            >
                              {coach.is_active ? (
                                <ToggleRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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

      {/* Send Credentials Confirmation Popup */}
      {showSendCredentialsPopup && selectedCoachForCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Login Credentials</h3>
              <p className="text-gray-600 mb-2">
                Send login credentials to <strong>{selectedCoachForCredentials.full_name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Email will be sent to: <strong>{selectedCoachForCredentials.contact_info.email}</strong>
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSendCredentialsPopup(false)
                    setSelectedCoachForCredentials(null)
                  }}
                  className="flex-1"
                  disabled={isSendingCredentials}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendCredentialsConfirm}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  disabled={isSendingCredentials}
                >
                  {isSendingCredentials ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Credentials'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
