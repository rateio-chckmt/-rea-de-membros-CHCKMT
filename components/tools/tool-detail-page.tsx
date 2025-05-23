"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Lock, User, Key } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { logToolAccess } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import type { Tool, ToolAccess, Profile, Category } from "@/types/database"

interface ToolDetailPageProps {
  tool: Tool & { category?: Category }
  accesses: ToolAccess[]
  userProfile: Profile
}

export default function ToolDetailPage({ tool, accesses, userProfile }: ToolDetailPageProps) {
  const [loading, setLoading] = useState(false)

  const handleAccessTool = async (access: ToolAccess) => {
    try {
      setLoading(true)

      // Log the access
      await logToolAccess(userProfile.id, tool.id)

      // Open the tool in a new tab
      window.open(access.url, "_blank")

      toast({
        title: "Access Logged",
        description: `Successfully accessed ${tool.name}`,
      })
    } catch (error) {
      console.error("Error logging access:", error)
      toast({
        title: "Error",
        description: "Failed to log access, but you can still use the tool",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-start gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image
                src={tool.icon_url || `/placeholder.svg?height=80&width=80&query=${tool.name} icon`}
                alt={tool.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
              <div className="flex items-center gap-2">
                {getStatusBadge("online")}
                {tool.is_free && <Badge variant="outline">Free</Badge>}
                {tool.category && (
                  <Badge
                    variant="outline"
                    style={{
                      background: `linear-gradient(135deg, ${tool.category.gradient_colors.from}, ${tool.category.gradient_colors.to})`,
                      color: "white",
                    }}
                  >
                    {tool.category.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="access" className="space-y-6">
          <TabsList>
            <TabsTrigger value="access">Access</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Access Points</CardTitle>
                <CardDescription>Choose an access point to use this tool</CardDescription>
              </CardHeader>
              <CardContent>
                {accesses.length > 0 ? (
                  <div className="grid gap-4">
                    {accesses.map((access) => (
                      <Card key={access.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                                <Key className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">{access.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {getStatusBadge(access.status)}
                                  <span className="text-sm text-gray-500">
                                    {access.username && (
                                      <>
                                        <User className="inline h-3 w-3 mr-1" />
                                        {access.username}
                                      </>
                                    )}
                                  </span>
                                </div>
                                {access.notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{access.notes}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleAccessTool(access)}
                              disabled={loading || access.status !== "online"}
                              className="ml-4"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Access Tool
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Access Available</h3>
                    <p>This tool doesn't have any configured access points yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
                <CardDescription>Detailed information about this tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-900 dark:text-white">
                    {tool.detailed_description || tool.description || "No detailed description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                    <p className="text-gray-900 dark:text-white">{tool.category?.name || "Uncategorized"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Required</h3>
                    <Badge variant="outline">{tool.min_plan_required}</Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Availability</h3>
                    <p className="text-gray-900 dark:text-white">
                      {tool.is_free ? "Free for all users" : "Premium feature"}
                    </p>
                  </div>

                  {tool.max_concurrent_users && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Max Concurrent Users</h3>
                      <p className="text-gray-900 dark:text-white">{tool.max_concurrent_users} users</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                  <p className="text-gray-900 dark:text-white">{new Date(tool.updated_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
