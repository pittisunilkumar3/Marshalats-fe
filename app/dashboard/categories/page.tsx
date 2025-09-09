"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Tag,
  Eye,
  EyeOff,
  Save,
  X
} from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { TokenManager } from "@/lib/tokenManager"

interface Category {
  id: string
  name: string
  code: string
  description?: string
  parent_category_id?: string
  is_active: boolean
  display_order: number
  icon_url?: string
  color_code?: string
  created_at: string
  updated_at: string
  course_count?: number
  subcategories?: Category[]
}

interface CategoryFormData {
  name: string
  code: string
  description: string
  parent_category_id: string
  is_active: boolean
  display_order: string
  icon_url: string
  color_code: string
}

interface FormErrors {
  [key: string]: string
}

export default function CategoriesManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    code: "",
    description: "",
    parent_category_id: "",
    is_active: true,
    display_order: "0",
    icon_url: "",
    color_code: ""
  })

  useEffect(() => {
    // Check authentication
    if (!TokenManager.isAuthenticated()) {
      router.push("/superadmin/login")
      return
    }

    // Check if user is superadmin
    const user = TokenManager.getUser()
    if (!user || user.role !== "superadmin") {
      router.push("/superadmin/login")
      return
    }

    fetchCategories()
  }, [])

  // Refetch categories when showActiveOnly changes
  useEffect(() => {
    fetchCategories()
  }, [showActiveOnly])

  const fetchCategories = async () => {
    try {
      const token = TokenManager.getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories?active_only=${showActiveOnly}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.categories) {
          setCategories(result.categories)
        }
      } else if (response.status === 401) {
        router.push("/superadmin/login")
      } else {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    }

    if (!formData.code.trim()) {
      newErrors.code = "Category code is required"
    } else if (!/^[A-Z0-9_]+$/.test(formData.code)) {
      newErrors.code = "Category code must contain only uppercase letters, numbers, and underscores"
    }

    if (formData.display_order && !/^\d+$/.test(formData.display_order)) {
      newErrors.display_order = "Display order must be a number"
    }

    if (formData.color_code && !/^#[0-9A-Fa-f]{6}$/.test(formData.color_code)) {
      newErrors.color_code = "Color code must be a valid hex color (e.g., #FF5722)"
    }

    // Check for duplicate code (excluding current category when editing)
    const existingCategory = categories.find(cat => 
      cat.code.toLowerCase() === formData.code.toLowerCase() && 
      cat.id !== editingCategory?.id
    )
    if (existingCategory) {
      newErrors.code = "Category code already exists"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const token = TokenManager.getToken()
      const apiPayload = {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        parent_category_id: (formData.parent_category_id && formData.parent_category_id !== "none") ? formData.parent_category_id : undefined,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order) || 0,
        icon_url: formData.icon_url || undefined,
        color_code: formData.color_code || undefined
      }

      const url = editingCategory 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${editingCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
          variant: "default"
        })
        
        setIsDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.detail || `Failed to ${editingCategory ? 'update' : 'create'} category`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      code: category.code,
      description: category.description || "",
      parent_category_id: category.parent_category_id || "none",
      is_active: category.is_active,
      display_order: category.display_order.toString(),
      icon_url: category.icon_url || "",
      color_code: category.color_code || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      return
    }

    try {
      const token = TokenManager.getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
          variant: "default"
        })
        fetchCategories()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.detail || "Failed to delete category",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      parent_category_id: "none",
      is_active: true,
      display_order: "0",
      icon_url: "",
      color_code: ""
    })
    setEditingCategory(null)
    setErrors({})
  }

  const handleNewCategory = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.code.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader currentPage="Categories" />
        <main className="w-full p-4 lg:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="Categories" />

      <main className="w-full p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
              <p className="text-gray-600">Manage course categories and their organization</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleNewCategory}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Category Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                        placeholder="Enter category name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                        Category Code *
                      </Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                        className={errors.code ? "border-red-500" : ""}
                        placeholder="CATEGORY_CODE"
                      />
                      {errors.code && (
                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parent_category_id" className="text-sm font-medium text-gray-700">
                        Parent Category
                      </Label>
                      <Select
                        value={formData.parent_category_id}
                        onValueChange={(value) => handleInputChange("parent_category_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Parent (Root Category)</SelectItem>
                          {categories
                            .filter(cat => cat.id !== editingCategory?.id)
                            .map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="display_order" className="text-sm font-medium text-gray-700">
                        Display Order
                      </Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => handleInputChange("display_order", e.target.value)}
                        className={errors.display_order ? "border-red-500" : ""}
                        placeholder="0"
                      />
                      {errors.display_order && (
                        <p className="mt-1 text-sm text-red-600">{errors.display_order}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon_url" className="text-sm font-medium text-gray-700">
                        Icon URL
                      </Label>
                      <Input
                        id="icon_url"
                        value={formData.icon_url}
                        onChange={(e) => handleInputChange("icon_url", e.target.value)}
                        placeholder="https://example.com/icon.png"
                      />
                    </div>

                    <div>
                      <Label htmlFor="color_code" className="text-sm font-medium text-gray-700">
                        Color Code
                      </Label>
                      <Input
                        id="color_code"
                        value={formData.color_code}
                        onChange={(e) => handleInputChange("color_code", e.target.value)}
                        className={errors.color_code ? "border-red-500" : ""}
                        placeholder="#FF5722"
                      />
                      {errors.color_code && (
                        <p className="mt-1 text-sm text-red-600">{errors.color_code}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange("is_active", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Active Category
                    </Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : (editingCategory ? "Update" : "Create")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={showActiveOnly ? "default" : "outline"}
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                    size="sm"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showActiveOnly ? "Active Only" : "All Categories"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categories ({filteredCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "No categories match your search criteria." : "Get started by creating your first category."}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={handleNewCategory}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Category
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {category.color_code && (
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: category.color_code }}
                                />
                              )}
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {category.code}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600 max-w-xs truncate block">
                              {category.description || "No description"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={category.is_active ? "default" : "secondary"}
                              className={category.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {category.is_active ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{category.display_order}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category.course_count || 0} courses
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(category)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
