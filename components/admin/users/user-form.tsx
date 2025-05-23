"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUser, updateUserRole } from "@/lib/api-utils"
import { createClient_Client } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import type { Profile } from "@/types/database"

interface UserFormProps {
  userId?: string
  initialData?: Partial<Profile>
}

export default function UserForm({ userId, initialData }: UserFormProps) {
  const router = useRouter()
  const supabase = createClient_Client()
  const isEditMode = !!userId

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user" as "user" | "admin",
    location: "",
    job_title: "",
    company: "",
    phone: "",
  })

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData((prev) => ({
        ...prev,
        full_name: initialData.full_name || "",
        role: (initialData.role as "user" | "admin") || "user",
        location: initialData.location || "",
        job_title: initialData.job_title || "",
        company: initialData.company || "",
        phone: initialData.phone || "",
      }))
    }
  }, [isEditMode, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "user" | "admin" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditMode) {
        // Update existing user
        await updateUserRole(userId!, formData.role)

        // Update profile data
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            location: formData.location,
            job_title: formData.job_title,
            company: formData.company,
            phone: formData.phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) throw error

        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        // Create new user
        if (!formData.email || !formData.password) {
          throw new Error("Email and password are required")
        }

        await createUser(formData.email, formData.password, {
          full_name: formData.full_name,
          role: formData.role,
          location: formData.location,
          job_title: formData.job_title,
          company: formData.company,
          phone: formData.phone,
        })

        toast({
          title: "Success",
          description: "User created successfully",
        })
      }

      router.push("/admin/users")
    } catch (error: any) {
      console.error("Error saving user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save user. Please try again.",
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
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold">{isEditMode ? "Edit User" : "Add New User"}</h2>
        <p className="text-gray-500">
          {isEditMode ? "Update user information and permissions" : "Create a new user account"}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEditMode ? "User Details" : "New User"}</CardTitle>
            <CardDescription>
              {isEditMode ? "Update the user's information and role" : "Enter the details for the new user"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" name="job_title" value={formData.job_title} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/users">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
