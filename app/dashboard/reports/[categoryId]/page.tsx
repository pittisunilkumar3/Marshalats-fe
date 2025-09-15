"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  FileText,
  TrendingUp,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { reportsAPI, ReportFilters, ReportFilterOptions } from "@/lib/reportsAPI"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import ErrorBoundary from "@/components/error-boundary"
import { useReportsApi } from "@/hooks/useApiWithRetry"
import {
  CategoryPageSkeleton,
  ReportItemsGridSkeleton,
  FilterSectionSkeleton,
  InlineLoader
} from "@/components/skeleton-loaders"
import { ReportsBreadcrumb } from "@/components/breadcrumb"
import { notFound } from 'next/navigation'
import { TokenManager } from "@/lib/tokenManager"
import { studentAPI } from "@/lib/studentAPI"

// Branch interface (same as branches page)
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
  is_active?: boolean
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
  statistics?: {
    coach_count: number
    student_count: number
    course_count: number
    active_courses: number
  }
  created_at: string
  updated_at: string
}

// Report categories data (same as main dashboard)
const REPORT_CATEGORIES = [
  {
    id: "student",
    name: "Student Reports",
    icon: FileText,
    description: "Student enrollment, attendance, and performance reports",
    reports: [
      { id: "student-enrollment-summary", name: "Student Enrollment Summary", icon: FileText },
      { id: "student-attendance-report", name: "Student Attendance Report", icon: TrendingUp },
      { id: "student-performance-analysis", name: "Student Performance Analysis", icon: FileText },
      { id: "student-payment-history", name: "Student Payment History", icon: FileText },
      { id: "student-transfer-requests", name: "Student Transfer Requests", icon: FileText },
      { id: "student-course-changes", name: "Student Course Changes", icon: FileText },
      { id: "student-complaints-report", name: "Student Complaints Report", icon: FileText },
      { id: "student-demographics", name: "Student Demographics", icon: TrendingUp }
    ]
  },
  {
    id: "master",
    name: "Master Reports",
    icon: TrendingUp,
    description: "Comprehensive system-wide reports and administrative summaries",
    reports: [
      { id: "system-overview-dashboard", name: "System Overview Dashboard", icon: TrendingUp },
      { id: "master-enrollment-report", name: "Master Enrollment Report", icon: FileText },
      { id: "master-attendance-summary", name: "Master Attendance Summary", icon: TrendingUp },
      { id: "master-financial-summary", name: "Master Financial Summary", icon: FileText },
      { id: "activity-log-report", name: "Activity Log Report", icon: FileText },
      { id: "system-usage-analytics", name: "System Usage Analytics", icon: TrendingUp },
      { id: "master-user-report", name: "Master User Report", icon: FileText },
      { id: "notification-delivery-report", name: "Notification Delivery Report", icon: FileText }
    ]
  },
  {
    id: "course",
    name: "Course Reports",
    icon: FileText,
    description: "Course enrollment, completion rates, and performance analytics",
    reports: [
      { id: "course-enrollment-statistics", name: "Course Enrollment Statistics", icon: TrendingUp },
      { id: "course-completion-rates", name: "Course Completion Rates", icon: FileText },
      { id: "course-popularity-analysis", name: "Course Popularity Analysis", icon: TrendingUp },
      { id: "course-revenue-report", name: "Course Revenue Report", icon: FileText },
      { id: "course-category-analysis", name: "Course Category Analysis", icon: TrendingUp },
      { id: "course-duration-effectiveness", name: "Course Duration Effectiveness", icon: FileText },
      { id: "course-feedback-summary", name: "Course Feedback Summary", icon: FileText },
      { id: "course-capacity-utilization", name: "Course Capacity Utilization", icon: TrendingUp }
    ]
  },
  {
    id: "coach",
    name: "Coach Reports",
    icon: FileText,
    description: "Coach performance, assignments, ratings, and analytics",
    reports: [
      { id: "coach-performance-summary", name: "Coach Performance Summary", icon: TrendingUp },
      { id: "coach-student-assignments", name: "Coach Student Assignments", icon: FileText },
      { id: "coach-ratings-analysis", name: "Coach Ratings Analysis", icon: TrendingUp },
      { id: "coach-attendance-tracking", name: "Coach Attendance Tracking", icon: FileText },
      { id: "coach-course-load", name: "Coach Course Load", icon: FileText },
      { id: "coach-feedback-report", name: "Coach Feedback Report", icon: FileText },
      { id: "coach-productivity-metrics", name: "Coach Productivity Metrics", icon: TrendingUp },
      { id: "coach-branch-distribution", name: "Coach Branch Distribution", icon: FileText }
    ]
  },
  {
    id: "branch",
    name: "Branch Reports",
    description: "Branch-wise analytics, performance, and operational reports",
    icon: TrendingUp,
    reports: [
      { id: "branch-performance-overview", name: "Branch Performance Overview", icon: TrendingUp },
      { id: "branch-enrollment-statistics", name: "Branch Enrollment Statistics", icon: FileText },
      { id: "branch-revenue-analysis", name: "Branch Revenue Analysis", icon: TrendingUp },
      { id: "branch-capacity-utilization", name: "Branch Capacity Utilization", icon: FileText },
      { id: "branch-staff-allocation", name: "Branch Staff Allocation", icon: FileText },
      { id: "branch-operational-hours", name: "Branch Operational Hours", icon: FileText },
      { id: "branch-comparison-report", name: "Branch Comparison Report", icon: TrendingUp },
      { id: "branch-growth-trends", name: "Branch Growth Trends", icon: TrendingUp }
    ]
  },
  {
    id: "financial",
    name: "Financial Reports",
    icon: FileText,
    description: "Payment, revenue, and financial analytics reports",
    reports: [
      { id: "revenue-summary-report", name: "Revenue Summary Report", icon: TrendingUp },
      { id: "payment-collection-analysis", name: "Payment Collection Analysis", icon: FileText },
      { id: "outstanding-dues-report", name: "Outstanding Dues Report", icon: FileText },
      { id: "payment-method-analysis", name: "Payment Method Analysis", icon: TrendingUp },
      { id: "monthly-financial-summary", name: "Monthly Financial Summary", icon: FileText },
      { id: "admission-fee-collection", name: "Admission Fee Collection", icon: TrendingUp },
      { id: "course-fee-breakdown", name: "Course Fee Breakdown", icon: FileText },
      { id: "refund-and-adjustments", name: "Refund and Adjustments", icon: FileText }
    ]
  }
]

// Enhanced component with error boundary wrapper
function CategoryReportsPageContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const categoryId = params.categoryId as string

  // Enhanced state management
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryLoading, setCategoryLoading] = useState<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  // Student search specific state
  const [searchLoading, setSearchLoading] = useState(false)
  const [studentResults, setStudentResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Financial search specific state
  const [financialResults, setFinancialResults] = useState<any[]>([])

  // Branch search specific state
  const [branchResults, setBranchResults] = useState<any[]>([])

  // Coach search specific state
  const [coachResults, setCoachResults] = useState<any[]>([])

  // Course search specific state
  const [courseResults, setCourseResults] = useState<any[]>([])

  // Master search specific state
  const [masterResults, setMasterResults] = useState<any[]>([])

  // Branch state (same as branches page)
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchesLoading, setBranchesLoading] = useState(false)
  const [branchesError, setBranchesError] = useState<string | null>(null)

  // Courses state for dynamic filtering
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [branchesWithCourses, setBranchesWithCourses] = useState<any[]>([])

  // Filter states with validation
  const [filters, setFilters] = useState<ReportFilters>({
    session: "",
    class: "",
    section: "",
    fees_type: "",
    branch_id: "",
    course_id: "",
    date_range: "",
    status: ""
  })

  // Custom date range state
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [showCustomDateInputs, setShowCustomDateInputs] = useState(false)

  // Use enhanced API hook with retry mechanism
  const {
    data: filterOptions,
    loading,
    error,
    retry: retryLoadOptions,
    reset: resetApiState
  } = useReportsApi(
    useCallback(() => {
      const token = TokenManager.getToken()
      if (!token) throw new Error('Authentication token not available')
      return reportsAPI.getReportFilters(token)
    }, []),
    {
      maxRetries: 2,
      retryDelay: 1500,
      showErrorToast: true,
      errorMessage: 'Failed to load filter options for this category.'
    }
  )

  // Get category information with validation
  const category = useMemo(() => {
    if (!categoryId || typeof categoryId !== 'string') return null
    return REPORT_CATEGORIES.find(cat => cat.id === categoryId) || null
  }, [categoryId])

  // Load filter options on component mount
  useEffect(() => {
    const token = TokenManager.getToken()
    if (token) {
      resetApiState()
    }
  }, [resetApiState])

  // Handle API errors with user feedback
  useEffect(() => {
    if (error && error !== lastError) {
      setLastError(error)
      console.error('Category page error:', error)
    }
  }, [error, lastError])

  // Fetch branches with courses for dynamic filtering
  useEffect(() => {
    const fetchBranchesWithCourses = async () => {
      try {
        setBranchesLoading(true)
        setBranchesError(null)

        const token = TokenManager.getToken()
        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        // Use the backend API endpoint for branches with courses
        const response = await fetch(`http://localhost:8003/api/branches-with-courses`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || errorData.message || `Failed to fetch branches with courses (${response.status})`)
        }

        const data = await response.json()
        console.log("Branches with courses fetched successfully for reports:", data)

        const branchesData = data.branches || []

        // Store branches with courses for dynamic filtering
        setBranchesWithCourses(branchesData)

        // Extract branches for dropdown (maintain compatibility)
        const branchesForDropdown = branchesData.map((branch: any) => ({
          id: branch.id,
          branch: branch.branch
        }))
        setBranches(branchesForDropdown)

        // Extract all courses from all branches
        const allCoursesFromBranches: any[] = []
        branchesData.forEach((branch: any) => {
          if (branch.courses && Array.isArray(branch.courses)) {
            branch.courses.forEach((course: any) => {
              // Add branch info to course for reference
              const courseWithBranch = {
                ...course,
                branch_id: branch.id,
                branch_name: branch.branch?.name || 'Unknown Branch'
              }
              allCoursesFromBranches.push(courseWithBranch)
            })
          }
        })

        console.log("All courses extracted:", allCoursesFromBranches)
        setAllCourses(allCoursesFromBranches)
        setFilteredCourses(allCoursesFromBranches) // Initially show all courses

      } catch (error) {
        console.error('Error fetching branches with courses for reports:', error)
        setBranchesError(error instanceof Error ? error.message : 'Failed to fetch branches with courses')
        toast.error('Failed to load branches and courses for filtering')
      } finally {
        setBranchesLoading(false)
      }
    }

    // Fetch branches with courses for all report categories that have branch dropdowns
    if (categoryId && ['student', 'financial', 'branch', 'coach', 'course', 'master'].includes(categoryId)) {
      fetchBranchesWithCourses()
    }
  }, [categoryId])

  // Dynamic course filtering based on selected branch
  useEffect(() => {
    if (!allCourses.length) return

    const selectedBranchId = filters.branch_id

    if (!selectedBranchId || selectedBranchId === 'all') {
      // Show all courses when no branch is selected or "All Branches" is selected
      setFilteredCourses(allCourses)
    } else {
      // Filter courses for the selected branch
      const coursesForBranch = allCourses.filter(course => course.branch_id === selectedBranchId)
      setFilteredCourses(coursesForBranch)

      // Clear course selection if the currently selected course is not available in the new branch
      if (filters.course_id && filters.course_id !== 'all') {
        const isCourseAvailable = coursesForBranch.some(course => course.id === filters.course_id)
        if (!isCourseAvailable) {
          // Clear course selection
          setFilters(prev => ({ ...prev, course_id: 'all' }))
        }
      }
    }
  }, [filters.branch_id, allCourses, filters.course_id])

  // Show skeleton loading for initial load
  if (loading && !filterOptions) {
    return <CategoryPageSkeleton />
  }

  // Show skeleton loading state for initial load
  if (loading && !filterOptions) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Reports" />
        <main className="w-full p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  const handleSearch = () => {
    toast.success('Search applied to report categories')
  }

  const handleDownloadReport = () => {
    toast.info('Download comprehensive reports')
  }

  const handleCategoryClick = (categoryId: string) => {
    // Find the category name for better user feedback
    const category = REPORT_CATEGORIES.find(cat => cat.id === categoryId)
    const categoryName = category?.name || categoryId

    // Show loading state for this specific category
    setCategoryLoading(categoryId)

    // Navigate to the category page
    setTimeout(() => {
      setCategoryLoading(null)
      router.push(`/dashboard/reports/${categoryId}`)
      toast.success(`Opening ${categoryName}...`)
    }, 300)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value
    }))

    // Handle custom date range visibility
    if (key === 'date_range') {
      setShowCustomDateInputs(value === 'custom')
      if (value !== 'custom') {
        setCustomStartDate("")
        setCustomEndDate("")
      }
    }
  }

  const handleStudentSearch = async () => {
    const token = TokenManager.getToken()
    if (!token) {
      toast.error('Authentication required')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

    try {
      // Build search parameters
      const searchParams: any = {}

      // Add text search query if provided
      if (searchQuery && searchQuery.trim().length >= 2) {
        searchParams.q = searchQuery.trim()
      }

      // Add filter parameters
      if (filters.branch_id && filters.branch_id !== 'all') {
        searchParams.branch_id = filters.branch_id
      }

      if (filters.course_id && filters.course_id !== 'all') {
        searchParams.course_id = filters.course_id
      }

      if (filters.status && filters.status !== 'all') {
        searchParams.is_active = filters.status === 'active'
      }

      // Add date range filtering
      if (filters.date_range && filters.date_range !== 'all') {
        const today = new Date()
        let startDate: Date | null = null
        let endDate: Date | null = null

        switch (filters.date_range) {
          case 'current-month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1)
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            break
          case 'last-month':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
            endDate = new Date(today.getFullYear(), today.getMonth(), 0)
            break
          case 'current-quarter':
            const currentQuarter = Math.floor(today.getMonth() / 3)
            startDate = new Date(today.getFullYear(), currentQuarter * 3, 1)
            endDate = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0)
            break
          case 'last-quarter':
            const lastQuarter = Math.floor(today.getMonth() / 3) - 1
            const quarterYear = lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear()
            const adjustedQuarter = lastQuarter < 0 ? 3 : lastQuarter
            startDate = new Date(quarterYear, adjustedQuarter * 3, 1)
            endDate = new Date(quarterYear, (adjustedQuarter + 1) * 3, 0)
            break
          case 'current-year':
            startDate = new Date(today.getFullYear(), 0, 1)
            endDate = new Date(today.getFullYear(), 11, 31)
            break
          case 'last-year':
            startDate = new Date(today.getFullYear() - 1, 0, 1)
            endDate = new Date(today.getFullYear() - 1, 11, 31)
            break
          case 'custom':
            if (customStartDate) {
              startDate = new Date(customStartDate)
            }
            if (customEndDate) {
              endDate = new Date(customEndDate)
            }
            break
        }

        if (startDate) {
          searchParams.start_date = startDate.toISOString()
        }
        if (endDate) {
          searchParams.end_date = endDate.toISOString()
        }
      }

      // Set pagination
      searchParams.skip = 0
      searchParams.limit = 100

      console.log('Student search parameters:', searchParams)

      // Call the comprehensive student search API
      const response = await studentAPI.searchStudents(token, searchParams)

      console.log('Student search response:', response)

      const students = response.students || []
      setStudentResults(students)

      const searchMessage = searchQuery
        ? `Found ${students.length} student${students.length !== 1 ? 's' : ''} matching "${searchQuery}"`
        : `Found ${students.length} student${students.length !== 1 ? 's' : ''}`

      toast.success(searchMessage)
    } catch (error) {
      console.error('Error searching students:', error)

      // Show error message
      toast.error('Failed to search students. Please try again.')

      // Clear results on error
      setStudentResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const generateMockStudentData = (filters: any) => {
    const mockStudents = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        course: 'Karate Beginner',
        branch: 'Downtown Branch',
        status: 'active',
        enrollment_date: '2024-01-15'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        course: 'Taekwondo Intermediate',
        branch: 'North Branch',
        status: 'active',
        enrollment_date: '2024-02-20'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        course: 'Jiu-Jitsu Advanced',
        branch: 'South Branch',
        status: 'graduated',
        enrollment_date: '2023-09-10'
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        course: 'Kickboxing',
        branch: 'Downtown Branch',
        status: 'inactive',
        enrollment_date: '2024-03-05'
      },
      {
        id: '5',
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@email.com',
        course: 'MMA Training',
        branch: 'West Branch',
        status: 'active',
        enrollment_date: '2024-01-30'
      }
    ]

    // Apply basic filtering for demonstration
    return mockStudents.filter(student => {
      if (filters.status && student.status !== filters.status) return false
      if (filters.branch_id && !student.branch.toLowerCase().includes('branch')) return false
      return true
    })
  }

  // Financial Reports Handler
  const handleFinancialSearch = async () => {
    const token = TokenManager.getToken()
    if (!token) {
      toast.error('Authentication required')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

    try {
      // Generate mock financial data for demonstration
      const mockFinancialData = generateMockFinancialData(filters)
      setFinancialResults(mockFinancialData)
      toast.success(`Found ${mockFinancialData.length} financial record${mockFinancialData.length !== 1 ? 's' : ''}`)
    } catch (error) {
      console.error('Error searching financial records:', error)
      const mockData = generateMockFinancialData(filters)
      setFinancialResults(mockData)
      toast.warning(`API unavailable. Showing ${mockData.length} sample record${mockData.length !== 1 ? 's' : ''}`)
    } finally {
      setSearchLoading(false)
    }
  }

  const generateMockFinancialData = (filters: any) => {
    const mockFinancialRecords = [
      {
        id: '1',
        transaction_id: 'TXN001',
        amount: 5000,
        branch: 'Downtown Branch',
        status: 'paid',
        date: '2024-01-15',
        student_name: 'John Smith',
        course: 'Karate Beginner'
      },
      {
        id: '2',
        transaction_id: 'TXN002',
        amount: 7500,
        branch: 'Uptown Branch',
        status: 'pending',
        date: '2024-01-16',
        student_name: 'Sarah Johnson',
        course: 'Taekwondo Advanced'
      },
      {
        id: '3',
        transaction_id: 'TXN003',
        amount: 3000,
        branch: 'Downtown Branch',
        status: 'overdue',
        date: '2024-01-10',
        student_name: 'Mike Wilson',
        course: 'Boxing Basics'
      },
      {
        id: '4',
        transaction_id: 'TXN004',
        amount: 12000,
        branch: 'Central Branch',
        status: 'paid',
        date: '2024-01-18',
        student_name: 'Emily Davis',
        course: 'MMA Training'
      },
      {
        id: '5',
        transaction_id: 'TXN005',
        amount: 4500,
        branch: 'Uptown Branch',
        status: 'cancelled',
        date: '2024-01-12',
        student_name: 'David Brown',
        course: 'Judo Intermediate'
      }
    ]

    // Apply filtering
    return mockFinancialRecords.filter(record => {
      if (filters.status && record.status !== filters.status) return false
      if (filters.branch_id && !record.branch.toLowerCase().includes('branch')) return false
      if (filters.amount_range) {
        const [min, max] = filters.amount_range.split('-').map(v => parseInt(v.replace(/[^\d]/g, '')))
        if (max && (record.amount < min || record.amount > max)) return false
        if (!max && filters.amount_range.includes('+') && record.amount < min) return false
      }
      return true
    })
  }

  // Branch Reports Handler
  const handleBranchSearch = async () => {
    const token = TokenManager.getToken()
    if (!token) {
      toast.error('Authentication required')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

    try {
      // Generate mock branch data for demonstration
      const mockBranchData = generateMockBranchData(filters)
      setBranchResults(mockBranchData)
      toast.success(`Found ${mockBranchData.length} branch${mockBranchData.length !== 1 ? 'es' : ''}`)
    } catch (error) {
      console.error('Error searching branch reports:', error)
      const mockData = generateMockBranchData(filters)
      setBranchResults(mockData)
      toast.warning(`API unavailable. Showing ${mockData.length} sample branch${mockData.length !== 1 ? 'es' : ''}`)
    } finally {
      setSearchLoading(false)
    }
  }

  const generateMockBranchData = (filters: any) => {
    const mockBranchData = [
      {
        id: '1',
        name: 'Downtown Branch',
        student_count: 125,
        revenue: 450000,
        status: 'active',
        performance_score: 92,
        location: 'Downtown Area',
        manager: 'John Manager'
      },
      {
        id: '2',
        name: 'Uptown Branch',
        student_count: 98,
        revenue: 380000,
        status: 'active',
        performance_score: 88,
        location: 'Uptown District',
        manager: 'Sarah Manager'
      },
      {
        id: '3',
        name: 'Central Branch',
        student_count: 156,
        revenue: 520000,
        status: 'active',
        performance_score: 95,
        location: 'Central City',
        manager: 'Mike Manager'
      },
      {
        id: '4',
        name: 'Eastside Branch',
        student_count: 67,
        revenue: 280000,
        status: 'under-review',
        performance_score: 75,
        location: 'East District',
        manager: 'Emily Manager'
      },
      {
        id: '5',
        name: 'Westside Branch',
        student_count: 89,
        revenue: 340000,
        status: 'expanding',
        performance_score: 85,
        location: 'West Area',
        manager: 'David Manager'
      }
    ]

    // Apply filtering
    return mockBranchData.filter(branch => {
      if (filters.status && branch.status !== filters.status) return false
      if (filters.branch_id && branch.id !== filters.branch_id) return false
      return true
    })
  }

  // Coach Reports Handler
  const handleCoachSearch = async () => {
    const token = TokenManager.getToken()
    if (!token) {
      toast.error('Authentication required')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

    try {
      // Generate mock coach data for demonstration
      const mockCoachData = generateMockCoachData(filters)
      setCoachResults(mockCoachData)
      toast.success(`Found ${mockCoachData.length} coach${mockCoachData.length !== 1 ? 'es' : ''}`)
    } catch (error) {
      console.error('Error searching coach reports:', error)
      const mockData = generateMockCoachData(filters)
      setCoachResults(mockData)
      toast.warning(`API unavailable. Showing ${mockData.length} sample coach${mockData.length !== 1 ? 'es' : ''}`)
    } finally {
      setSearchLoading(false)
    }
  }

  const generateMockCoachData = (filters: any) => {
    const mockCoachData = [
      {
        id: '1',
        name: 'Sensei John Martinez',
        branch: 'Downtown Branch',
        experience: '10+ years',
        status: 'active',
        rating: 95,
        specialization: 'Karate',
        students: 45
      },
      {
        id: '2',
        name: 'Master Chen Wei',
        branch: 'Uptown Branch',
        experience: '5-10 years',
        status: 'active',
        rating: 92,
        specialization: 'Kung Fu',
        students: 38
      },
      {
        id: '3',
        name: 'Coach Sarah Williams',
        branch: 'Central Branch',
        experience: '3-5 years',
        status: 'active',
        rating: 88,
        specialization: 'Taekwondo',
        students: 52
      },
      {
        id: '4',
        name: 'Sifu David Thompson',
        branch: 'Eastside Branch',
        experience: '1-3 years',
        status: 'on-leave',
        rating: 85,
        specialization: 'Boxing',
        students: 28
      },
      {
        id: '5',
        name: 'Instructor Emily Davis',
        branch: 'Westside Branch',
        experience: '5-10 years',
        status: 'active',
        rating: 90,
        specialization: 'MMA',
        students: 41
      }
    ]

    // Apply filtering
    return mockCoachData.filter(coach => {
      if (filters.status && coach.status !== filters.status) return false
      if (filters.branch_id && !coach.branch.toLowerCase().includes('branch')) return false
      if (filters.experience && coach.experience !== filters.experience) return false
      if (filters.rating) {
        const ratingRange = {
          'excellent': [90, 100],
          'good': [80, 89],
          'average': [70, 79],
          'below-average': [60, 69],
          'poor': [0, 59]
        }[filters.rating]
        if (ratingRange && (coach.rating < ratingRange[0] || coach.rating > ratingRange[1])) return false
      }
      return true
    })
  }

  // Course Reports Handler
  const handleCourseSearch = async () => {
    const token = TokenManager.getToken()
    if (!token) {
      toast.error('Authentication required')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

    try {
      // Generate mock course data for demonstration
      const mockCourseData = generateMockCourseData(filters)
      setCourseResults(mockCourseData)
      toast.success(`Found ${mockCourseData.length} course${mockCourseData.length !== 1 ? 's' : ''}`)
    } catch (error) {
      console.error('Error searching course reports:', error)
      const mockData = generateMockCourseData(filters)
      setCourseResults(mockData)
      toast.warning(`API unavailable. Showing ${mockData.length} sample course${mockData.length !== 1 ? 's' : ''}`)
    } finally {
      setSearchLoading(false)
    }
  }

  const generateMockCourseData = (filters: any) => {
    const mockCourseData = [
      {
        id: '1',
        title: 'Karate Beginner',
        category: 'Martial Arts',
        enrolled: 25,
        capacity: 30,
        status: 'open',
        instructor: 'Sensei John Martinez',
        branch: 'Downtown Branch',
        price: 5000
      },
      {
        id: '2',
        title: 'Taekwondo Advanced',
        category: 'Martial Arts',
        enrolled: 20,
        capacity: 20,
        status: 'full',
        instructor: 'Coach Sarah Williams',
        branch: 'Central Branch',
        price: 7500
      },
      {
        id: '3',
        title: 'Boxing Basics',
        category: 'Combat Sports',
        enrolled: 18,
        capacity: 25,
        status: 'open',
        instructor: 'Sifu David Thompson',
        branch: 'Eastside Branch',
        price: 4000
      },
      {
        id: '4',
        title: 'MMA Training',
        category: 'Mixed Martial Arts',
        enrolled: 15,
        capacity: 18,
        status: 'open',
        instructor: 'Instructor Emily Davis',
        branch: 'Westside Branch',
        price: 8000
      },
      {
        id: '5',
        title: 'Kung Fu Traditional',
        category: 'Martial Arts',
        enrolled: 0,
        capacity: 22,
        status: 'upcoming',
        instructor: 'Master Chen Wei',
        branch: 'Uptown Branch',
        price: 6000
      }
    ]

    // Apply filtering
    return mockCourseData.filter(course => {
      if (filters.course_id && course.id !== filters.course_id) return false
      if (filters.category_id && !course.category.toLowerCase().includes('martial')) return false
      if (filters.branch_id && !course.branch.toLowerCase().includes('branch')) return false
      if (filters.enrollment_status && course.status !== filters.enrollment_status) return false
      return true
    })
  }

  // Master Reports Handler
  const handleMasterSearch = async () => {
    const token = TokenManager.getToken()
    if (!token) {
      toast.error('Authentication required')
      return
    }

    setSearchLoading(true)
    setHasSearched(true)

    try {
      // Generate mock master report data for demonstration
      const mockMasterData = generateMockMasterData(filters)
      setMasterResults(mockMasterData)
      toast.success(`Generated ${mockMasterData.length} master report${mockMasterData.length !== 1 ? 's' : ''}`)
    } catch (error) {
      console.error('Error generating master reports:', error)
      const mockData = generateMockMasterData(filters)
      setMasterResults(mockData)
      toast.warning(`API unavailable. Showing ${mockData.length} sample report${mockData.length !== 1 ? 's' : ''}`)
    } finally {
      setSearchLoading(false)
    }
  }

  const generateMockMasterData = (filters: any) => {
    const mockMasterData = [
      {
        id: '1',
        name: 'System Overview Dashboard',
        type: 'performance',
        scope: 'System-wide',
        status: 'completed',
        generated_date: '2024-01-20',
        data_points: 1250,
        file_size: '2.5 MB'
      },
      {
        id: '2',
        name: 'Master Enrollment Report',
        type: 'enrollment',
        scope: 'All Branches',
        status: 'completed',
        generated_date: '2024-01-19',
        data_points: 890,
        file_size: '1.8 MB'
      },
      {
        id: '3',
        name: 'Financial Summary Report',
        type: 'financial',
        scope: 'System-wide',
        status: 'completed',
        generated_date: '2024-01-18',
        data_points: 2100,
        file_size: '3.2 MB'
      },
      {
        id: '4',
        name: 'Attendance Analytics',
        type: 'attendance',
        scope: 'All Branches',
        status: 'processing',
        generated_date: '2024-01-20',
        data_points: 1500,
        file_size: 'Processing...'
      },
      {
        id: '5',
        name: 'User Activity Report',
        type: 'user-activity',
        scope: 'System-wide',
        status: 'completed',
        generated_date: '2024-01-17',
        data_points: 980,
        file_size: '1.5 MB'
      }
    ]

    // Apply filtering
    return mockMasterData.filter(report => {
      if (filters.report_type && report.type !== filters.report_type) return false
      if (filters.branch_id && filters.branch_id !== 'all' && filters.branch_id !== 'system-wide' && !report.scope.toLowerCase().includes('branch')) return false
      return true
    })
  }

  const handleViewStudentDetails = (studentId: string) => {
    if (studentId) {
      router.push(`/dashboard/students/${studentId}`)
      toast.success('Opening student details...')
    } else {
      toast.error('Student ID not available')
    }
  }

  // Filter categories based on search term
  const filteredCategories = REPORT_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Reports" />

      <main className="w-full p-4 lg:p-6 max-w-7xl mx-auto">


        {/* Page Header - Same as main reports page */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">
              Comprehensive system reports and analytics
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={handleSearch}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
            <Button
              className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center space-x-2"
              onClick={handleDownloadReport}
            >
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
              placeholder="Search report categories..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Report Categories Grid - Same as main page */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 bg-white border border-gray-200 active:scale-95 h-full flex flex-col"
                onClick={() => handleCategoryClick(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCategoryClick(category.id)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${category.name}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {categoryLoading === category.id ? (
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    ) : (
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    )}
                    <CardTitle className="text-lg">
                      {category.name}
                      {categoryLoading === category.id && (
                        <span className="text-sm text-blue-600 ml-2">Opening...</span>
                      )}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-gray-600 mb-4 flex-1">{category.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500">
                      {category.reports.length} reports available
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation() // Prevent event bubbling
                        handleCategoryClick(category.id)
                      }}
                      disabled={categoryLoading === category.id}
                      className="min-w-[100px]" // Prevent button size changes
                    >
                      {categoryLoading === category.id ? 'Opening...' : 'View Reports'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Financial Reports Search/Filter Card - Only show for financial category */}
        {categoryId === 'financial' && (
          <>
            {/* Search/Filter Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Search Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Branch Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <Select
                      value={filters.branch_id || "all"}
                      onValueChange={(value) => handleFilterChange('branch_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select Branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.filter(branch => branch.id && branch.branch?.name).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branch?.name || 'N/A'} ({branch.branch?.code || branch.id})
                          </SelectItem>
                        ))}
                        {branchesError && (
                          <SelectItem value="" disabled>
                            Error loading branches
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {branchesError && (
                      <p className="text-sm text-red-600 mt-1">
                        {branchesError}
                      </p>
                    )}
                  </div>

                  {/* Payment Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <Select
                      value={filters.date_range || "all"}
                      onValueChange={(value) => handleFilterChange('date_range', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="current-week">Current Week</SelectItem>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                    <Select
                      value={filters.amount_range || "all"}
                      onValueChange={(value) => handleFilterChange('amount_range', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Amount Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Amounts</SelectItem>
                        <SelectItem value="0-1000">₹0 - ₹1,000</SelectItem>
                        <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                        <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                        <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                        <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                        <SelectItem value="50000+">₹50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleFinancialSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Financial Records
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Financial Reports Results</CardTitle>
                {financialResults.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Found {financialResults.length} financial record{financialResults.length !== 1 ? 's' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Loading financial data...</p>
                    </div>
                  </div>
                ) : financialResults.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Transaction ID</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Amount</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Branch</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financialResults.map((record, index) => (
                            <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-3 px-4 text-sm text-gray-900">{record.transaction_id}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden sm:table-cell">₹{record.amount?.toLocaleString()}</td>
                              <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{record.branch}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  record.status === 'paid' ? 'bg-green-100 text-green-800' :
                                  record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  record.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  record.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">{record.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No Financial Records Found</p>
                      <p className="text-gray-600">
                        No financial records match your search criteria. Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Branch Reports Search/Filter Card - Only show for branch category */}
        {categoryId === 'branch' && (
          <>
            {/* Search/Filter Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Search Branch Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Branch Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <Select
                      value={filters.branch_id || "all"}
                      onValueChange={(value) => handleFilterChange('branch_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select Branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.filter(branch => branch.id && branch.branch?.name).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branch?.name || 'N/A'} ({branch.branch?.code || branch.id})
                          </SelectItem>
                        ))}
                        {branchesError && (
                          <SelectItem value="" disabled>
                            Error loading branches
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {branchesError && (
                      <p className="text-sm text-red-600 mt-1">
                        {branchesError}
                      </p>
                    )}
                  </div>

                  {/* Performance Metric */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance Metric</label>
                    <Select
                      value={filters.metric || "all"}
                      onValueChange={(value) => handleFilterChange('metric', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Metrics</SelectItem>
                        <SelectItem value="enrollment">Enrollment Rate</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="retention">Student Retention</SelectItem>
                        <SelectItem value="satisfaction">Satisfaction Score</SelectItem>
                        <SelectItem value="attendance">Attendance Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <Select
                      value={filters.date_range || "all"}
                      onValueChange={(value) => handleFilterChange('date_range', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Status</label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="expanding">Expanding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleBranchSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Branch Reports
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Branch Reports Results</CardTitle>
                {branchResults.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Found {branchResults.length} branch{branchResults.length !== 1 ? 'es' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Loading branch data...</p>
                    </div>
                  </div>
                ) : branchResults.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Branch Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Students</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Revenue</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {branchResults.map((branch, index) => (
                            <tr key={branch.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-3 px-4 text-sm text-gray-900">{branch.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden sm:table-cell">{branch.student_count}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden md:table-cell">₹{branch.revenue?.toLocaleString()}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  branch.status === 'active' ? 'bg-green-100 text-green-800' :
                                  branch.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                  branch.status === 'under-review' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {branch.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">{branch.performance_score}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No Branch Reports Found</p>
                      <p className="text-gray-600">
                        No branch reports match your search criteria. Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Coach Reports Search/Filter Card - Only show for coach category */}
        {categoryId === 'coach' && (
          <>
            {/* Search/Filter Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Search Coach Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Branch Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <Select
                      value={filters.branch_id || "all"}
                      onValueChange={(value) => handleFilterChange('branch_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select Branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.filter(branch => branch.id && branch.branch?.name).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branch?.name || 'N/A'} ({branch.branch?.code || branch.id})
                          </SelectItem>
                        ))}
                        {branchesError && (
                          <SelectItem value="" disabled>
                            Error loading branches
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {branchesError && (
                      <p className="text-sm text-red-600 mt-1">
                        {branchesError}
                      </p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <Select
                      value={filters.experience || "all"}
                      onValueChange={(value) => handleFilterChange('experience', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="0-1 years">0-1 years</SelectItem>
                        <SelectItem value="1-3 years">1-3 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5-10 years">5-10 years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Performance Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating</label>
                    <Select
                      value={filters.rating || "all"}
                      onValueChange={(value) => handleFilterChange('rating', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="excellent">Excellent (90-100%)</SelectItem>
                        <SelectItem value="good">Good (80-89%)</SelectItem>
                        <SelectItem value="average">Average (70-79%)</SelectItem>
                        <SelectItem value="below-average">Below Average (60-69%)</SelectItem>
                        <SelectItem value="poor">Poor (Below 60%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Coach Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coach Status</label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                        <SelectItem value="probation">On Probation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleCoachSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Coach Reports
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Coach Reports Results</CardTitle>
                {coachResults.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Found {coachResults.length} coach{coachResults.length !== 1 ? 'es' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Loading coach data...</p>
                    </div>
                  </div>
                ) : coachResults.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Coach Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Branch</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Experience</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coachResults.map((coach, index) => (
                            <tr key={coach.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-3 px-4 text-sm text-gray-900">{coach.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden sm:table-cell">{coach.branch}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden md:table-cell">{coach.experience}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  coach.status === 'active' ? 'bg-green-100 text-green-800' :
                                  coach.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                  coach.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {coach.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">{coach.rating}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No Coach Reports Found</p>
                      <p className="text-gray-600">
                        No coach reports match your search criteria. Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Course Reports Search/Filter Card - Only show for course category */}
        {categoryId === 'course' && (
          <>
            {/* Search/Filter Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Search Course Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Course Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <Select
                      value={filters.course_id || "all"}
                      onValueChange={(value) => handleFilterChange('course_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {filterOptions?.filter_options?.courses?.filter(course => course.id && course.title).map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select
                      value={filters.category_id || "all"}
                      onValueChange={(value) => handleFilterChange('category_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {filterOptions?.filter_options?.categories?.filter(category => category.id && category.name).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <Select
                      value={filters.branch_id || "all"}
                      onValueChange={(value) => handleFilterChange('branch_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select Branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.filter(branch => branch.id && branch.branch?.name).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branch?.name || 'N/A'} ({branch.branch?.code || branch.id})
                          </SelectItem>
                        ))}
                        {branchesError && (
                          <SelectItem value="" disabled>
                            Error loading branches
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {branchesError && (
                      <p className="text-sm text-red-600 mt-1">
                        {branchesError}
                      </p>
                    )}
                  </div>

                  {/* Enrollment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Status</label>
                    <Select
                      value={filters.enrollment_status || "all"}
                      onValueChange={(value) => handleFilterChange('enrollment_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open for Enrollment</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleCourseSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Course Reports
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Course Reports Results</CardTitle>
                {courseResults.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Found {courseResults.length} course{courseResults.length !== 1 ? 's' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Loading course data...</p>
                    </div>
                  </div>
                ) : courseResults.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Course Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Category</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Enrolled</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Instructor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseResults.map((course, index) => (
                            <tr key={course.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-3 px-4 text-sm text-gray-900">{course.title}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden sm:table-cell">{course.category}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden md:table-cell">{course.enrolled}/{course.capacity}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  course.status === 'open' ? 'bg-green-100 text-green-800' :
                                  course.status === 'full' ? 'bg-yellow-100 text-yellow-800' :
                                  course.status === 'closed' ? 'bg-red-100 text-red-800' :
                                  course.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {course.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">{course.instructor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No Course Reports Found</p>
                      <p className="text-gray-600">
                        No course reports match your search criteria. Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Master Reports Search/Filter Card - Only show for master category */}
        {categoryId === 'master' && (
          <>
            {/* Search/Filter Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Search Master Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <Select
                      value={filters.report_type || "all"}
                      onValueChange={(value) => handleFilterChange('report_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Report Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="enrollment">Enrollment Analytics</SelectItem>
                        <SelectItem value="financial">Financial Summary</SelectItem>
                        <SelectItem value="performance">Performance Metrics</SelectItem>
                        <SelectItem value="attendance">Attendance Analytics</SelectItem>
                        <SelectItem value="user-activity">User Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch Scope */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Scope</label>
                    <Select
                      value={filters.branch_id || "all"}
                      onValueChange={(value) => handleFilterChange('branch_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select Scope"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.filter(branch => branch.id && branch.branch?.name).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branch?.name || 'N/A'} ({branch.branch?.code || branch.id})
                          </SelectItem>
                        ))}
                        {branchesError && (
                          <SelectItem value="" disabled>
                            Error loading branches
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {branchesError && (
                      <p className="text-sm text-red-600 mt-1">
                        {branchesError}
                      </p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <Select
                      value={filters.date_range || "all"}
                      onValueChange={(value) => handleFilterChange('date_range', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Data Granularity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Granularity</label>
                    <Select
                      value={filters.granularity || "all"}
                      onValueChange={(value) => handleFilterChange('granularity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Granularity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleMasterSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Generate Master Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Master Reports Results</CardTitle>
                {masterResults.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Generated {masterResults.length} master report{masterResults.length !== 1 ? 's' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Generating master reports...</p>
                    </div>
                  </div>
                ) : masterResults.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Report Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Scope</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Generated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {masterResults.map((report, index) => (
                            <tr key={report.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-3 px-4 text-sm text-gray-900">{report.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden sm:table-cell">{report.type}</td>
                              <td className="py-3 px-4 text-sm text-gray-900 hidden md:table-cell">{report.scope}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  report.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  report.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                  report.status === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {report.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600 hidden lg:table-cell">{report.generated_date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No Master Reports Generated</p>
                      <p className="text-gray-600">
                        No master reports match your criteria. Try adjusting your filters and generate new reports.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Student Reports Search/Filter Card - Only show for student category */}
        {categoryId === 'student' && (
          <>
            {/* Search/Filter Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Search Student Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Students</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleStudentSearch()
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Search by student name, email, or phone number (minimum 2 characters)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Branch Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <Select
                      value={filters.branch_id || "all"}
                      onValueChange={(value) => handleFilterChange('branch_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select Branch"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.filter(branch => branch.id && branch.branch?.name).map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branch?.name || 'N/A'} ({branch.branch?.code || branch.id})
                          </SelectItem>
                        ))}
                        {branchesError && (
                          <SelectItem value="" disabled>
                            Error loading branches
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {branchesError && (
                      <p className="text-sm text-red-600 mt-1">
                        {branchesError}
                      </p>
                    )}
                  </div>

                  {/* Course Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <Select
                      value={filters.course_id || "all"}
                      onValueChange={(value) => handleFilterChange('course_id', value)}
                      disabled={branchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={branchesLoading ? "Loading courses..." : "Select Course"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {filteredCourses.filter(course => course.id && (course.title || course.name)).map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title || course.name} ({course.code || course.id})
                          </SelectItem>
                        ))}
                        {filteredCourses.length === 0 && filters.branch_id && filters.branch_id !== 'all' && (
                          <SelectItem value="" disabled>
                            No courses available for selected branch
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {filteredCourses.length === 0 && filters.branch_id && filters.branch_id !== 'all' && (
                      <p className="text-sm text-gray-500 mt-1">
                        No courses assigned to the selected branch
                      </p>
                    )}
                  </div>

                  {/* Date Range Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <Select
                      value={filters.date_range || "all"}
                      onValueChange={(value) => handleFilterChange('date_range', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="current-month">Current Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="current-quarter">Current Quarter</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="current-year">Current Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Date Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Date Range Inputs */}
                  {showCustomDateInputs && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    onClick={handleStudentSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Students
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Student Reports Results</CardTitle>
                {studentResults.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Found {studentResults.length} student{studentResults.length !== 1 ? 's' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {searchLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">Loading student data...</p>
                    </div>
                  </div>
                ) : studentResults.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Student Details</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">Contact</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden md:table-cell">Courses</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden lg:table-cell">Branch</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm hidden xl:table-cell">Registration</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentResults.map((student, index) => (
                            <tr key={student.id || index} className="hover:bg-gray-50 transition-colors">
                              {/* Student Details */}
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                    <span className="text-blue-600 font-medium text-sm">
                                      {(student.full_name || student.first_name || 'N').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-900 truncate">
                                      {student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      ID: {student.id?.substring(0, 8) || 'N/A'}
                                    </p>
                                    {student.date_of_birth && (
                                      <p className="text-xs text-gray-400 truncate">
                                        DOB: {new Date(student.date_of_birth).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Contact Information */}
                              <td className="py-4 px-4 hidden sm:table-cell">
                                <div className="text-sm">
                                  <p className="text-gray-900 truncate">{student.email || 'No email'}</p>
                                  <p className="text-gray-500 truncate">{student.phone || 'No phone'}</p>
                                  {student.gender && (
                                    <p className="text-xs text-gray-400 capitalize">{student.gender}</p>
                                  )}
                                </div>
                              </td>

                              {/* Courses */}
                              <td className="py-4 px-4 hidden md:table-cell">
                                <div className="text-sm">
                                  {student.courses && student.courses.length > 0 ? (
                                    <div className="space-y-1">
                                      {student.courses.slice(0, 2).map((course: any, idx: number) => (
                                        <div key={idx} className="flex items-center">
                                          <span className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                                            {course.name || course.title || 'Unknown Course'}
                                          </span>
                                        </div>
                                      ))}
                                      {student.courses.length > 2 && (
                                        <p className="text-xs text-gray-500">
                                          +{student.courses.length - 2} more
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-xs">No courses</span>
                                  )}
                                </div>
                              </td>

                              {/* Branch */}
                              <td className="py-4 px-4 hidden lg:table-cell">
                                <div className="text-sm">
                                  {student.branches && student.branches.length > 0 ? (
                                    <div className="space-y-1">
                                      {student.branches.slice(0, 1).map((branch: any, idx: number) => (
                                        <div key={idx}>
                                          <p className="text-gray-900 truncate">{branch.name || 'Unknown Branch'}</p>
                                          {branch.code && (
                                            <p className="text-xs text-gray-500">({branch.code})</p>
                                          )}
                                        </div>
                                      ))}
                                      {student.branches.length > 1 && (
                                        <p className="text-xs text-gray-500">
                                          +{student.branches.length - 1} more
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-xs">No branch</span>
                                  )}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                <div className="flex flex-col space-y-1">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {student.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                  {student.total_enrollments > 0 && (
                                    <span className="text-xs text-gray-500">
                                      {student.active_enrollments}/{student.total_enrollments} enrollments
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Registration Date */}
                              <td className="py-4 px-4 text-gray-900 text-sm hidden xl:table-cell">
                                <div className="text-sm">
                                  {student.created_at ? (
                                    <>
                                      <p>{new Date(student.created_at).toLocaleDateString()}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(student.created_at).toLocaleDateString('en-US', {
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </>
                                  ) : (
                                    'N/A'
                                  )}
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewStudentDetails(student.id)}
                                    className="text-xs px-2 py-1"
                                  >
                                    View
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : hasSearched ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No Students Found</p>
                      <p className="text-gray-600">
                        No students match your search criteria. Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">Search for Students</p>
                      <p className="text-gray-600">
                        Use the filters above to search for student reports and data.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

// Main component wrapped with error boundary
export default function CategoryReportsPage() {
  return (
    <ErrorBoundary
      title="Category Reports Error"
      description="The category reports page encountered an unexpected error. Please try refreshing the page or return to the main reports dashboard."
      showRetry={true}
      showHome={true}
      showBack={true}
      onError={(error, errorInfo) => {
        console.error('Category reports page error:', error, errorInfo)
      }}
    >
      <CategoryReportsPageContent />
    </ErrorBoundary>
  )
}
