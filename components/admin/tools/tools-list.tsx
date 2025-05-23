"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { getTools, deleteTool, getToolCategories } from "@/lib/api-utils"
import { DataTable } from "@/components/admin/data-table"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  MoreHorizontal,
  Plus,
  Trash,
  Edit,
  ExternalLink,
  Filter,
  Download,
  Eye,
  BarChart2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { format } from "date-fns"
import type { Tool, ToolCategory } from "@/types/database"

interface ToolsListProps {
  initialPage: number
  initialSearch: string
  initialCategory: string
  initialStatus: string
}

export default function ToolsList({ initialPage, initialSearch, initialCategory, initialStatus }: ToolsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<ToolCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)
  const [status, setStatus] = useState(initialStatus)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [advancedFilters, setAdvancedFilters] = useState({
    hasUrl: false,
    hasIcon: false,
    hasFeatures: false,
    dateFrom: "",
    dateTo: "",
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getTools(pagination.page, pagination.limit, search, category, status)

      // Apply client-side sorting
      let sortedTools = [...result.tools]
      if (sortField) {
        sortedTools.sort((a, b) => {
          // Handle nested fields like category.name
          if (sortField.includes(".")) {
            const [parent, child] = sortField.split(".")
            const aValue = a[parent]?.[child] || ""
            const bValue = b[parent]?.[child] || ""
            return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          }

          // Handle regular fields
          const aValue = a[sortField] || ""
          const bValue = b[sortField] || ""

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          }

          return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1
        })
      }

      // Apply client-side advanced filtering
      if (advancedFilters.hasUrl) {
        sortedTools = sortedTools.filter((tool) => !!tool.url)
      }
      if (advancedFilters.hasIcon) {
        sortedTools = sortedTools.filter((tool) => !!tool.icon)
      }
      if (advancedFilters.hasFeatures) {
        sortedTools = sortedTools.filter((tool) => tool.features && tool.features.length > 0)
      }
      if (advancedFilters.dateFrom) {
        const fromDate = new Date(advancedFilters.dateFrom)
        sortedTools = sortedTools.filter((tool) => new Date(tool.created_at) >= fromDate)
      }
      if (advancedFilters.dateTo) {
        const toDate = new Date(advancedFilters.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        sortedTools = sortedTools.filter((tool) => new Date(tool.created_at) <= toDate)
      }

      setTools(sortedTools)
      setPagination({
        page: result.page,
        limit: result.limit,
        totalItems: result.count,
        totalPages: result.totalPages,
      })
    } catch (error) {
      console.error("Error fetching tools:", error)
      toast({
        title: "Error",
        description: "Failed to load tools. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, category, status, sortField, sortDirection, advancedFilters])

  const fetchCategories = async () => {
    try {
      const result = await getToolCategories()
      setCategories(result)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchTools()

    // Update URL with current filters
    const params = new URLSearchParams(searchParams)
    params.set("page", pagination.page.toString())
    if (search) params.set("search", search)
    else params.delete("search")
    if (category) params.set("category", category)
    else params.delete("category")
    if (status) params.set("status", status)
    else params.delete("status")

    router.replace(`${pathname}?${params.toString()}`)
  }, [pagination.page, search, category, status, fetchTools, router, pathname, searchParams])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handleSearch = (query: string) => {
    setSearch(query)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleCategoryFilter = (value: string) => {
    setCategory(value === "all" ? "" : value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleStatusFilter = (value: string) => {
    setStatus(value === "all" ? "" : value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDeleteTool = async (toolId: string) => {
    try {
      await deleteTool(toolId)
      toast({
        title: "Success",
        description: "Tool deleted successfully",
      })
      fetchTools()
      setSelectedTools((prev) => prev.filter((id) => id !== toolId))
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast({
        title: "Error",
        description: "Failed to delete tool. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      setLoading(true)
      for (const toolId of selectedTools) {
        await deleteTool(toolId)
      }
      toast({
        title: "Success",
        description: `${selectedTools.length} tools deleted successfully`,
      })
      setSelectedTools([])
      fetchTools()
    } catch (error) {
      console.error("Error deleting tools:", error)
      toast({
        title: "Error",
        description: "Failed to delete tools. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTools(tools.map((tool) => tool.id))
    } else {
      setSelectedTools([])
    }
  }

  const handleSelectTool = (toolId: string, checked: boolean) => {
    if (checked) {
      setSelectedTools((prev) => [...prev, toolId])
    } else {
      setSelectedTools((prev) => prev.filter((id) => id !== toolId))
    }
  }

  const resetFilters = () => {
    setAdvancedFilters({
      hasUrl: false,
      hasIcon: false,
      hasFeatures: false,
      dateFrom: "",
      dateTo: "",
    })
  }

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    setIsFilterOpen(false)
  }

  const exportTools = () => {
    // Create CSV content
    const headers = ["Name", "Category", "Status", "URL", "Created At", "Updated At"]
    const rows = tools.map((tool) => [
      tool.name,
      tool.category?.name || "Uncategorized",
      tool.status,
      tool.url || "",
      tool.created_at,
      tool.updated_at,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `tools-export-${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "maintenance":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Maintenance
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          checked={selectedTools.length === tools.length && tools.length > 0}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
      ),
      cell: (row: Tool) => (
        <Checkbox
          checked={selectedTools.includes(row.id)}
          onCheckedChange={(checked) => handleSelectTool(row.id, !!checked)}
          aria-label={`Select ${row.name}`}
        />
      ),
      width: "40px",
    },
    {
      key: "tool",
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
          Tool
          {sortField === "name" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            ))}
        </div>
      ),
      cell: (row: Tool) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image
              src={row.icon || `/placeholder.svg?height=40&width=40&query=${row.name} icon`}
              alt={row.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-gray-500 truncate max-w-[200px]">{row.description || "No description"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("category.name")}>
          Category
          {sortField === "category.name" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            ))}
        </div>
      ),
      cell: (row: Tool) => (
        <div>
          {row.category ? (
            <Badge
              variant="outline"
              style={{
                background: `linear-gradient(135deg, ${row.category.gradient.split(",")[0].split(" ")[0]} 0%, rgba(255,255,255,0.1) 100%)`,
                borderColor: row.category.gradient.split(",")[0].split(" ")[0],
              }}
            >
              {row.category.name}
            </Badge>
          ) : (
            <span className="text-gray-500">Uncategorized</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("status")}>
          Status
          {sortField === "status" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            ))}
        </div>
      ),
      cell: (row: Tool) => getStatusBadge(row.status),
    },
    {
      key: "features",
      header: "Features",
      cell: (row: Tool) => (
        <div className="flex flex-wrap gap-1">
          {row.features && row.features.length > 0 ? (
            <Badge variant="outline" className="bg-gray-100">
              {row.features.length} feature{row.features.length !== 1 ? "s" : ""}
            </Badge>
          ) : (
            <span className="text-gray-500">No features</span>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("created_at")}>
          Created
          {sortField === "created_at" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            ))}
        </div>
      ),
      cell: (row: Tool) => (
        <div className="text-sm text-gray-500">{format(new Date(row.created_at), "dd MMM yyyy")}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row: Tool) => (
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
              <Link href={`/admin/tools/view/${row.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/tools/${row.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Tool
              </Link>
            </DropdownMenuItem>
            {row.url && (
              <DropdownMenuItem asChild>
                <a href={row.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open URL
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/admin/analytics?tool=${row.id}`}>
                <BarChart2 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              title="Delete Tool"
              description="Are you sure you want to delete this tool? This action cannot be undone."
              confirmText="Delete"
              variant="destructive"
              onConfirm={() => handleDeleteTool(row.id)}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Tool
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
          <h2 className="text-2xl font-bold">Tool Management</h2>
          <p className="text-gray-500">Manage tools and their categories</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/tools/categories">Manage Categories</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/tools/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Tool
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tools</CardTitle>
          <CardDescription>View and manage all tools in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={category || "all"} onValueChange={handleCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status || "all"} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetDescription>Apply additional filters to narrow down your search results.</SheetDescription>
                  </SheetHeader>

                  <div className="py-4 space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="properties">
                        <AccordionTrigger>Properties</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="has-url"
                              checked={advancedFilters.hasUrl}
                              onCheckedChange={(checked) =>
                                setAdvancedFilters((prev) => ({ ...prev, hasUrl: !!checked }))
                              }
                            />
                            <label
                              htmlFor="has-url"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Has URL
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="has-icon"
                              checked={advancedFilters.hasIcon}
                              onCheckedChange={(checked) =>
                                setAdvancedFilters((prev) => ({ ...prev, hasIcon: !!checked }))
                              }
                            />
                            <label
                              htmlFor="has-icon"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Has Icon
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="has-features"
                              checked={advancedFilters.hasFeatures}
                              onCheckedChange={(checked) =>
                                setAdvancedFilters((prev) => ({ ...prev, hasFeatures: !!checked }))
                              }
                            />
                            <label
                              htmlFor="has-features"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Has Features
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="date-range">
                        <AccordionTrigger>Date Range</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <label htmlFor="date-from" className="text-sm font-medium">
                              From Date
                            </label>
                            <Input
                              id="date-from"
                              type="date"
                              value={advancedFilters.dateFrom}
                              onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="date-to" className="text-sm font-medium">
                              To Date
                            </label>
                            <Input
                              id="date-to"
                              type="date"
                              value={advancedFilters.dateTo}
                              onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <SheetFooter className="pt-2">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <SheetClose asChild>
                      <Button onClick={applyFilters}>Apply Filters</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="icon" onClick={exportTools}>
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={fetchTools}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedTools.length > 0 && (
            <div className="mb-4 p-2 bg-muted rounded-md flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedTools.length} tool{selectedTools.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTools([])}>
                  Clear Selection
                </Button>
                <ConfirmDialog
                  title="Delete Selected Tools"
                  description={`Are you sure you want to delete ${selectedTools.length} selected tools? This action cannot be undone.`}
                  confirmText="Delete All"
                  variant="destructive"
                  onConfirm={handleBulkDelete}
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Selected
                    </Button>
                  }
                />
              </div>
            </div>
          )}

          {loading && tools.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <DataTable
              data={tools}
              columns={columns}
              pagination={{
                page: pagination.page,
                limit: pagination.limit,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                onPageChange: handlePageChange,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
