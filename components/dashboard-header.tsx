"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, MoreHorizontal, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { searchAPI, SearchResult, GlobalSearchResponse } from "@/lib/searchAPI"
import SearchResults from "@/components/search-results"
import NotificationDropdown from "@/components/notification-dropdown"

interface DashboardHeaderProps {
  currentPage?: string;
}

export default function DashboardHeader({ currentPage = "Dashboard" }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await searchAPI.globalSearch(query, token, { limit: 10 });
      const transformedResults = searchAPI.transformResults(response);

      setSearchResults(transformedResults);
      setTotalResults(response.total_results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.length >= 2) {
        performSearch(searchQuery);
      }
    }
    if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  };

  // Mobile navigation handler
  const handleMobileNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  // Check if current path is active
  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4 lg:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <img
                src="/placeholder-logo.svg"
                alt="Logo"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl hidden lg:inline">Rock</span>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <img
                        src="/placeholder-logo.svg"
                        alt="Logo"
                        className="w-8 h-8"
                      />
                      <span className="font-bold text-xl">Rock</span>
                    </div>
                  </div>
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleMobileNavigation("/dashboard")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium ${
                          isActivePath("/dashboard") && pathname === "/dashboard" ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("/dashboard/branches")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                          isActivePath("/dashboard/branches") ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Branches
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("/dashboard/coaches")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                          isActivePath("/dashboard/coaches") ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Masters
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("/dashboard/students")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                          isActivePath("/dashboard/students") ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Students
                      </button>

                      <button
                        onClick={() => handleMobileNavigation("/dashboard/courses")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                          isActivePath("/dashboard/courses") ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Courses
                      </button>
                      <button
                        onClick={() => handleMobileNavigation("/dashboard/courses/assign/students")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                          isActivePath("/dashboard/courses/assign") ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Assign Courses
                      </button>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-gray-500 mb-2">Attendance</p>
                        <button
                          onClick={() => handleMobileNavigation("/dashboard/attendance/students")}
                          className={`w-full text-left px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 ${
                            isActivePath("/dashboard/attendance/students") ? "bg-yellow-50 text-yellow-700" : ""
                          }`}
                        >
                          Student Attendance
                        </button>
                        <button
                          onClick={() => handleMobileNavigation("/dashboard/attendance/coaches")}
                          className={`w-full text-left px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 ${
                            isActivePath("/dashboard/attendance/coaches") ? "bg-yellow-50 text-yellow-700" : ""
                          }`}
                        >
                          Coach Attendance
                        </button>
                      </div>
                      <button
                        onClick={() => handleMobileNavigation("/dashboard/reports")}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                          isActivePath("/dashboard/reports") ? "bg-yellow-50 text-yellow-700" : ""
                        }`}
                      >
                        Reports
                      </button>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-gray-500 mb-2">More</p>
                        <button
                          onClick={() => handleMobileNavigation("/dashboard/payment-tracking")}
                          className={`w-full text-left px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 ${
                            isActivePath("/dashboard/payment-tracking") ? "bg-yellow-50 text-yellow-700" : ""
                          }`}
                        >
                          Payment Tracking
                        </button>
                        <button
                          onClick={() => handleMobileNavigation("/dashboard/operations")}
                          className={`w-full text-left px-3 py-1 rounded-md hover:bg-gray-100 text-sm text-gray-600 ${
                            isActivePath("/dashboard/operations") ? "bg-yellow-50 text-yellow-700" : ""
                          }`}
                        >
                          Operations
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 overflow-x-auto">
              <button
                onClick={() => router.push("/dashboard")}
                className={`pb-4 text-sm font-medium whitespace-nowrap cursor-pointer border-b-2 ${
                  pathname === "/dashboard" 
                    ? "text-gray-900 border-yellow-400" 
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push("/dashboard/branches")}
                className={`pb-4 text-sm whitespace-nowrap cursor-pointer border-b-2 ${
                  isActivePath("/dashboard/branches") 
                    ? "text-gray-900 border-yellow-400" 
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Branches
              </button>
              <button 
                onClick={() => router.push("/dashboard/coaches")}
                className={`pb-4 text-sm whitespace-nowrap cursor-pointer border-b-2 ${
                  isActivePath("/dashboard/coaches") 
                    ? "text-gray-900 border-yellow-400" 
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Masters
              </button>
              <button 
                onClick={() => router.push("/dashboard/students")}
                className={`pb-4 text-sm whitespace-nowrap cursor-pointer border-b-2 ${
                  isActivePath("/dashboard/students") 
                    ? "text-gray-900 border-yellow-400" 
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Students
              </button>

              <button
                onClick={() => router.push("/dashboard/courses")}
                className={`pb-4 text-sm whitespace-nowrap cursor-pointer border-b-2 ${
                  isActivePath("/dashboard/courses")
                    ? "text-gray-900 border-yellow-400"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => router.push("/dashboard/courses/assign/students")}
                className={`pb-4 text-sm whitespace-nowrap cursor-pointer border-b-2 ${
                  isActivePath("/dashboard/courses/assign")
                    ? "text-gray-900 border-yellow-400"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Assign Courses
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`pb-4 text-sm whitespace-nowrap flex items-center cursor-pointer border-b-2 ${
                    isActivePath("/dashboard/attendance") 
                      ? "text-gray-900 border-yellow-400" 
                      : "text-gray-600 hover:text-gray-900 border-transparent"
                  }`}>
                    Attendance
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/attendance/students")}>
                    Student Attendance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/attendance/coaches")}>
                    Coach Attendance
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button 
                onClick={() => router.push("/dashboard/reports")}
                className={`pb-4 text-sm whitespace-nowrap cursor-pointer border-b-2 ${
                  isActivePath("/dashboard/reports") 
                    ? "text-gray-900 border-yellow-400" 
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                Reports
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-600 hover:text-gray-600 p-1 cursor-pointer">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/categories")}>
                    Categories Management
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/payment-tracking")}>
                    Payment Tracking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/operations")}>
                    Operations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Search and User Controls */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <div className="relative hidden lg:block" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Try searching: User Name, Course Name, User ID"
                className="pl-10 w-64 xl:w-80 bg-gray-50"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyPress}
              />
              {showSearchResults && (
                <SearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  query={searchQuery}
                  totalResults={totalResults}
                  onClose={handleCloseSearch}
                />
              )}
            </div>

            <NotificationDropdown />

            <div className="relative z-[1000]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden lg:inline">Super admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 z-[1000]" 
                    sideOffset={8}
                  >
                    <DropdownMenuItem 
                      onClick={() => router.push("/dashboard/profile")}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push("/dashboard/settings")}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm text-red-600 focus:bg-red-50"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
