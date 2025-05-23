"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createTool, updateTool, getToolCategories } from "@/lib/api-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Plus, X, Upload, LinkIcon, Settings, Info, List } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import type { Tool, ToolCategory } from "@/types/database"
import { Badge } from "@/components/ui/badge"

interface ToolFormProps {
  toolId?: string
  initialData?: Tool
}

export default function ToolForm({ toolId, initialData }: ToolFormProps) {
  const router = useRouter()
  const isEditMode = !!toolId

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<ToolCategory[]>([])
  const [formData, setFormData] = useState<Partial<Tool>>({
    name: "",
    description: "",
    long_description: "",
    icon: "",
    url: "",
    category_id: "uncategorized", // Updated default value to be a non-empty string
    status: "online",
    features: [],
  })
  const [featureInput, setFeatureInput] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getToolCategories()
        setCategories(result)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        long_description: initialData.long_description || "",
        icon: initialData.icon || "",
        url: initialData.url || "",
        category_id: initialData.category_id || "uncategorized", // Updated default value to be a non-empty string
        status: initialData.status || "online",
        features: initialData.features || [],
      })

      if (initialData.icon) {
        setPreviewImage(initialData.icon)
      }
    }
  }, [isEditMode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }))
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to a storage service
      // and then set the URL. For this example, we'll use a local preview.
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreviewImage(result)
        // In a real app, you would set formData.icon to the uploaded file URL
        // For now, we'll just use a placeholder
        setFormData((prev) => ({
          ...prev,
          icon: `/placeholder.svg?height=100&width=100&query=${formData.name} icon`,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name) {
        throw new Error("Tool name is required")
      }

      if (isEditMode) {
        await updateTool(toolId!, formData)
        toast({
          title: "Success",
          description: "Tool updated successfully",
        })
      } else {
        await createTool(formData)
        toast({
          title: "Success",
          description: "Tool created successfully",
        })
      }

      router.push("/admin/tools")
    } catch (error: any) {
      console.error("Error saving tool:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

      <div>
        <h2 className="text-2xl font-bold">{isEditMode ? "Edit Tool" : "Add New Tool"}</h2>
        <p className="text-gray-500">{isEditMode ? "Update tool information" : "Create a new tool"}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">
              <Info className="mr-2 h-4 w-4" />
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="details">
              <List className="mr-2 h-4 w-4" />
              Details & Features
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic information for the tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Tool Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter tool name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <Select
                      value={formData.category_id || "uncategorized"} // Updated default value to be a non-empty string
                      onValueChange={(value) => handleSelectChange("category_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the tool"
                    rows={2}
                  />
                  <p className="text-sm text-gray-500">
                    A short description that will be displayed in the tool cards (max 150 characters)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Tool URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-sm text-gray-500">The URL where users can access this tool</p>
                </div>

                <div className="space-y-2">
                  <Label>Tool Icon</Label>
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <Image
                        src={
                          previewImage || `/placeholder.svg?height=96&width=96&query=${formData.name || "Tool"} icon`
                        }
                        alt="Icon Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <label htmlFor="icon-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Icon
                          </label>
                        </Button>
                        <Input
                          id="icon-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleIconChange}
                        />
                        {previewImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewImage(null)
                              setFormData((prev) => ({ ...prev, icon: "" }))
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Upload a square icon (PNG or SVG recommended). Max size: 2MB.
                      </div>
                      <div className="text-sm text-gray-500">Or enter an icon URL:</div>
                      <Input
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={(e) => {
                          handleChange(e)
                          if (e.target.value) {
                            setPreviewImage(e.target.value)
                          }
                        }}
                        placeholder="/icons/tool-icon.png"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/admin/tools">Cancel</Link>
                </Button>
                <Button type="button" onClick={() => setActiveTab("details")}>
                  Next: Details & Features
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Details & Features</CardTitle>
                <CardDescription>Add detailed information and features for the tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="long_description">Long Description</Label>
                  <Textarea
                    id="long_description"
                    name="long_description"
                    value={formData.long_description}
                    onChange={handleChange}
                    placeholder="Detailed description of the tool"
                    rows={6}
                  />
                  <p className="text-sm text-gray-500">
                    A detailed description that will be displayed on the tool's detail page
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    List the key features of this tool. Each feature should be concise and specific.
                  </p>
                  <div className="mt-2 space-y-2">
                    {(formData.features || []).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-800"
                      >
                        <span>{feature}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {(formData.features || []).length === 0 && (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                        No features added yet. Add some features to highlight what this tool offers.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back: Basic Information
                </Button>
                <Button type="button" onClick={() => setActiveTab("settings")}>
                  Next: Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure additional settings for the tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Set the current status of this tool</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tool Preview</h3>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={
                            previewImage || `/placeholder.svg?height=64&width=64&query=${formData.name || "Tool"} icon`
                          }
                          alt="Icon Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{formData.name || "Tool Name"}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formData.description || "Tool description will appear here"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {formData.status === "online" && <Badge className="bg-green-500">Online</Badge>}
                          {formData.status === "offline" && <Badge variant="destructive">Offline</Badge>}
                          {formData.status === "maintenance" && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                              Maintenance
                            </Badge>
                          )}

                          {formData.category_id && categories.find((c) => c.id === formData.category_id) && (
                            <Badge
                              variant="outline"
                              style={{
                                background: `linear-gradient(135deg, ${
                                  categories
                                    .find((c) => c.id === formData.category_id)
                                    ?.gradient.split(",")[0]
                                    .split(" ")[0]
                                } 0%, rgba(255,255,255,0.1) 100%)`,
                                borderColor: categories
                                  .find((c) => c.id === formData.category_id)
                                  ?.gradient.split(",")[0]
                                  .split(" ")[0],
                              }}
                            >
                              {categories.find((c) => c.id === formData.category_id)?.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Back: Details & Features
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update Tool"
                  ) : (
                    "Create Tool"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
