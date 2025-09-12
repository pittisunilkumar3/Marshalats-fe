"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Edit, Trash2, X, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import { TokenManager } from "@/lib/tokenManager"

interface Branch {
  id: string
  branch: {
    name: string
    code: string
    email: string
    phone: string
    address: {
      line1: string
      area: string
      city: string
      state: string
      pincode: string
      country: string
    }
  }
  manager_id: string
  operational_details: {
    courses_offered: string[]
    timings: Array<{
      day: string
      open: string
      close: string
    }>
    holidays: string[]
  }
  assignments: {
    accessories_available: boolean
    courses: string[]
    branch_admins: string[]
  }
  bank_details: {
    bank_name: string
    account_number: string
    upi_id: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function BranchesList() {
  const router = useRouter()
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCoach, setSelectedCoach] = useState("")
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/branches`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to fetch branches (${response.status})`)
        }

        const data = await response.json()
        console.log("Branches fetched successfully:", data)

        // Handle different response formats
        const branchesData = data.branches || data || []
        setBranches(branchesData)

      } catch (error) {
        console.error("Error fetching branches:", error)
        setError(error instanceof Error ? error.message : 'Failed to fetch branches')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const handleAssign = () => {
    if (selectedBranch && selectedCoach) {
      // In a real implementation, this would call an API to assign the coach to the branch
      console.log(`Assigning coach ${selectedCoach} to branch ${selectedBranch}`)
      setSelectedBranch("")
      setSelectedCoach("")
      setShowAssignPopup(false)
    }
  }

  const handleDeleteClick = (branchId: string) => {
    setBranchToDelete(branchId)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (branchToDelete) {
      try {
        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/branches/${branchToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to delete branch (${response.status})`)
        }

        // Remove branch from local state
        setBranches(branches.filter(branch => branch.id !== branchToDelete))
        setBranchToDelete(null)
        setShowDeletePopup(false)

      } catch (error) {
        console.error("Error deleting branch:", error)
        alert(`Error deleting branch: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const handleViewClick = (branchId: string) => {
    router.push(`/dashboard/branches/${branchId}`)
  }

  const handleEditClick = (branchId: string) => {
    router.push(`/dashboard/branches/edit/${branchId}`)
  }

  const handleDeleteCancel = () => {
    setShowDeletePopup(false)
    setBranchToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DashboardHeader currentPage="Branches" />

      <main className="w-full p-4 lg:p-6 overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Branches list</h1>
          <div className="flex space-x-3">
            <Button
              onClick={() => router.push("/dashboard/create-branch")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium"
            >
              + Add Branch
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              onClick={() => setShowAssignPopup(true)}
            >
              Assign Manager
            </Button>
          </div>
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
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-8 px-6 text-center text-gray-500">
                    Loading branches...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={11} className="py-8 px-6 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 px-6 text-center text-gray-500">
                    No branches found
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.branch.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                      {`${branch.branch.address.line1}, ${branch.branch.address.city}, ${branch.branch.address.state}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.operational_details.courses_offered.length}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{branch.manager_id || 'Not Assigned'}</span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1 w-fit">
                          Manager
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {branch.assignments.accessories_available ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.branch.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{branch.branch.phone}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-600"
                          onClick={() => handleViewClick(branch.id)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditClick(branch.id)}
                          title="Edit Branch"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteClick(branch.id)}
                          title="Delete Branch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Switch
                          checked={branch.is_active}
                          className="data-[state=checked]:bg-yellow-400"
                          onCheckedChange={async (checked) => {
                            try {
                              const token = TokenManager.getToken()
                              if (!token) return

                              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/branches/${branch.id}`, {
                                method: 'PUT',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ is_active: checked })
                              })

                              if (response.ok) {
                                setBranches(branches.map(b =>
                                  b.id === branch.id ? { ...b, is_active: checked } : b
                                ))
                              }
                            } catch (error) {
                              console.error("Error updating branch status:", error)
                            }
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
