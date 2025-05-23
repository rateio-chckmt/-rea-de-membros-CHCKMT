"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { getUsers, deleteUser, updateUserRole } from "@/lib/api-utils"
import { DataTable } from "@/components/admin/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MoreHorizontal, Trash, UserCog, UserPlus, Shield, User } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface UsersListProps {
  initialPage: number
  initialSearch: string
  initialRole: string
}

export default function UsersList({ initialPage, initialSearch, initialRole }: UsersListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState(initialSearch)
  const [role, setRole] = useState(initialRole)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const result = await getUsers(pagination.page, pagination.limit, search, role)
      setUsers(result.users)
      setPagination({
        page: result.page,
        limit: result.limit,
        totalItems: result.count,
        totalPages: result.totalPages,
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()

    // Update URL with current filters
    const params = new URLSearchParams(searchParams)
    params.set("page", pagination.page.toString())
    if (search) params.set("search", search)
    else params.delete("search")
    if (role) params.set("role", role)
    else params.delete("role")

    router.replace(`${pathname}?${params.toString()}`)
  }, [pagination.page, search, role])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleSearch = (query: string) => {
    setSearch(query)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleRoleFilter = (value: string) => {
    setRole(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      await updateUserRole(userId, newRole)
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      })
      fetchUsers()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.avatar_url || "/placeholder.svg"} alt={row.full_name || row.user.email} />
            <AvatarFallback>{(row.full_name?.charAt(0) || row.user.email.charAt(0)).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.full_name || "N/A"}</div>
            <div className="text-sm text-gray-500">{row.user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (row: any) => (
        <Badge variant={row.role === "admin" ? "default" : "secondary"}>
          {row.role === "admin" ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
          {row.role}
        </Badge>
      ),
    },
    {
      key: "created",
      header: "Created",
      cell: (row: any) => (
        <div className="text-sm">
          {row.user.created_at ? format(new Date(row.user.created_at), "MMM d, yyyy") : "N/A"}
        </div>
      ),
    },
    {
      key: "last_login",
      header: "Last Login",
      cell: (row: any) => (
        <div className="text-sm">
          {row.user.last_sign_in_at ? format(new Date(row.user.last_sign_in_at), "MMM d, yyyy") : "Never"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${row.id}`}>
                <UserCog className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleUpdateRole(row.id, row.role === "admin" ? "user" : "admin")}>
              {row.role === "admin" ? (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Change to User
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Change to Admin
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              title="Delete User"
              description="Are you sure you want to delete this user? This action cannot be undone."
              confirmText="Delete"
              variant="destructive"
              onConfirm={() => handleDeleteUser(row.id)}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/add">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1">
              <Select value={role} onValueChange={handleRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <DataTable
              data={users}
              columns={columns}
              pagination={{
                page: pagination.page,
                limit: pagination.limit,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                onPageChange: handlePageChange,
              }}
              searchable
              searchPlaceholder="Search by name or email..."
              onSearch={handleSearch}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
