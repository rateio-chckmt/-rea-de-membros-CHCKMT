"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getToolCategories, createToolCategory, updateToolCategory, deleteToolCategory } from "@/lib/api-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Edit, Trash, ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ToolCategory } from "@/types/database"

export default function CategoriesList() {
  const router = useRouter()
  const [categories, setCategories] = useState<ToolCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<ToolCategory>>({
    name: "",
    description: "",
    gradient: "hsl(221, 83%, 53%), hsl(221, 83%, 43%)",
    icon: "",
  })
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const result = await getToolCategories()
      setCategories(result)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = async () => {
    try {
      setFormLoading(true)

      if (!formData.name) {
        throw new Error("Category name is required")
      }

      await createToolCategory(formData)
      toast({
        title: "Success",
        description: "Category created successfully",
      })

      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        gradient: "hsl(221, 83%, 53%), hsl(221, 83%, 43%)",
        icon: "",
      })

      fetchCategories()
    } catch (error: any) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditCategory = async () => {
    try {
      setFormLoading(true)

      if (!formData.name) {
        throw new Error("Category name is required")
      }

      if (!editingCategoryId) {
        throw new Error("Category ID is missing")
      }

      await updateToolCategory(editingCategoryId, formData)
      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      setIsEditDialogOpen(false)
      setEditingCategoryId(null)
      setFormData({
        name: "",
        description: "",
        gradient: "hsl(221, 83%, 53%), hsl(221, 83%, 43%)",
        icon: "",
      })

      fetchCategories()
    } catch (error: any) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteToolCategory(categoryId)
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (category: ToolCategory) => {
    setEditingCategoryId(category.id)
    setFormData({
      name: category.name,
      description: category.description || "",
      gradient: category.gradient,
      icon: category.icon || "",
    })
    setIsEditDialogOpen(true)
  }

  const gradientOptions = [
    { value: "hsl(221, 83%, 53%), hsl(221, 83%, 43%)", label: "Blue" },
    { value: "hsl(142, 76%, 36%), hsl(142, 76%, 26%)", label: "Green" },
    { value: "hsl(0, 91%, 71%), hsl(0, 91%, 61%)", label: "Red" },
    { value: "hsl(47, 96%, 67%), hsl(47, 96%, 57%)", label: "Yellow" },
    { value: "hsl(262, 83%, 58%), hsl(262, 83%, 48%)", label: "Purple" },
    { value: "hsl(199, 89%, 48%), hsl(199, 89%, 38%)", label: "Cyan" },
    { value: "hsl(31, 95%, 65%), hsl(31, 95%, 55%)", label: "Orange" },
    { value: "hsl(338, 95%, 56%), hsl(338, 95%, 46%)", label: "Pink" },
    { value: "hsl(171, 77%, 64%), hsl(171, 77%, 54%)", label: "Teal" },
    { value: "hsl(291, 64%, 42%), hsl(291, 64%, 32%)", label: "Indigo" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tool Categories</h2>
          <p className="text-gray-500">Manage categories for organizing tools</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category for organizing tools</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradient">Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {gradientOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`h-8 rounded-md cursor-pointer border-2 ${
                        formData.gradient === option.value ? "border-primary" : "border-transparent"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${option.value.split(", ")[0]} 0%, ${option.value.split(", ")[1]} 100%)`,
                      }}
                      onClick={() => setFormData((prev) => ({ ...prev, gradient: option.value }))}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Optional)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Enter icon URL or class name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div
                    className="h-8 w-8 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${category.gradient.split(", ")[0]} 0%, ${category.gradient.split(", ")[1]} 100%)`,
                    }}
                  />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <ConfirmDialog
                      title="Delete Category"
                      description="Are you sure you want to delete this category? Tools in this category will become uncategorized."
                      confirmText="Delete"
                      variant="destructive"
                      onConfirm={() => handleDeleteCategory(category.id)}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description || "No description provided"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>
                      {gradientOptions.find((opt) => opt.value === category.gradient)?.label || "Custom"} gradient
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {categories.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No Categories Found</h3>
                  <p className="text-gray-500 mt-1">Create your first category to start organizing your tools</p>
                  <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-gradient">Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {gradientOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`h-8 rounded-md cursor-pointer border-2 ${
                      formData.gradient === option.value ? "border-primary" : "border-transparent"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${option.value.split(", ")[0]} 0%, ${option.value.split(", ")[1]} 100%)`,
                    }}
                    onClick={() => setFormData((prev) => ({ ...prev, gradient: option.value }))}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon (Optional)</Label>
              <Input
                id="edit-icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="Enter icon URL or class name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
