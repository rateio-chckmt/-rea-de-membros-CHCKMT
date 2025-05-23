"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BarChart3, Ticket, ExternalLink, Settings, User, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import type { Profile, Category, Tool, AccessLog, SupportTicket } from "@/types/database"

interface DashboardContentProps {
  profile: Profile
  categories: Category[]
  tools: (Tool & { category?: Category })[]
  recentAccess: (AccessLog & { tool?: Tool })[]
  tickets: SupportTicket[]
}

export default function DashboardContent({ profile, categories, tools, recentAccess, tickets }: DashboardContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredTools = selectedCategory ? tools.filter((tool) => tool.category_id === selectedCategory) : tools

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

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case "free":
        return <Badge variant="outline">Free</Badge>
      case "pro":
        return <Badge className="bg-blue-500">Pro</Badge>
      case "premium":
        return <Badge className="bg-purple-500">Premium</Badge>
      case "custom":
        return <Badge className="bg-gold-500">Custom</Badge>
      default:
        return <Badge variant="secondary">{planType}</Badge>
    }
  }

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-500">Open</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {profile.full_name}!</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Plan: {getPlanBadge(profile.plan_type)} • Status: {profile.account_status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tools</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tools.length}</div>
              <p className="text-xs text-muted-foreground">{tools.filter((t) => t.is_free).length} free tools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Access</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentAccess.length}</div>
              <p className="text-xs text-muted-foreground">Last 5 accessed tools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.length}</div>
              <p className="text-xs text-muted-foreground">
                {tickets.filter((t) => t.status === "open").length} open tickets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">Tool categories available</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            {/* Categories Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Filter tools by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                  >
                    All Tools
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      size="sm"
                      style={{
                        background:
                          selectedCategory === category.id
                            ? `linear-gradient(135deg, ${category.gradient_colors.from}, ${category.gradient_colors.to})`
                            : undefined,
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={tool.icon_url || `/placeholder.svg?height=48&width=48&query=${tool.name} icon`}
                            alt={tool.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tool.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge("online")}
                            {tool.is_free && <Badge variant="outline">Free</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {tool.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">{tool.category?.name || "Uncategorized"}</div>
                      <Button size="sm" asChild>
                        <Link href={`/tools/${tool.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Access
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent tool access history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAccess.length > 0 ? (
                  <div className="space-y-4">
                    {recentAccess.map((access) => (
                      <div
                        key={access.id}
                        className="flex items-center gap-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800"
                      >
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium">{access.tool?.name || "Unknown Tool"}</div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(access.accessed_at), { addSuffix: true })}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/tools/${access.tool_id}`}>Access Again</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">No recent activity found.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>Your recent support requests</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/support/new">
                      <Ticket className="mr-2 h-4 w-4" />
                      New Ticket
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center gap-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800"
                      >
                        <Ticket className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-sm text-gray-500">
                            Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTicketStatusBadge(ticket.status)}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/support/${ticket.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">No support tickets found.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
