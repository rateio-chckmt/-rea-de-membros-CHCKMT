"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteTool } from "@/lib/api-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "@/components/ui/use-toast"
import { format, formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Edit,
  Trash,
  ExternalLink,
  BarChart2,
  Clock,
  User,
  Star,
  Info,
  Settings,
  Activity,
} from "lucide-react"
import type { Tool, AccessLog, UserFavorite } from "@/types/database"

interface ToolViewProps {
  tool: Tool
  accessLogs: (AccessLog & {
    user?: {
      id: string
      email: string
      profile?: {
        full_name?: string
      }
    }
  })[]
  favorites: (UserFavorite & {
    user?: {
      id: string
      email: string
      profile?: {
        full_name?: string
      }
    }
  })[]
}

export default function ToolView({ tool, accessLogs, favorites }: ToolViewProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDeleteTool = async () => {
    try {
      setLoading(true)
      await deleteTool(tool.id)
      toast({
        title: "Success",
        description: "Tool deleted successfully",
      })
      router.push("/admin/tools")
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast({
        title: "Error",
        description: "Failed to delete tool. Please try again.",
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image
              src={tool.icon || `/placeholder.svg?height=64&width=64&query=${tool.name} icon`}
              alt={tool.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{tool.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(tool.status)}
              {tool.category && (
                <Badge
                  variant="outline"
                  style={{
                    background: `linear-gradient(135deg, ${tool.category.gradient.split(",")[0].split(" ")[0]} 0%, rgba(255,255,255,0.1) 100%)`,
                    borderColor: tool.category.gradient.split(",")[0].split(" ")[0],
                  }}
                >
                  {tool.category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tool.url && (
            <Button variant="outline" asChild>
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Tool
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/analytics?tool=${tool.id}`}>
              <BarChart2 className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/tools/${tool.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tool
            </Link>
          </Button>
          <ConfirmDialog
            title="Delete Tool"
            description="Are you sure you want to delete this tool? This action cannot be undone."
            confirmText="Delete"
            variant="destructive"
            onConfirm={handleDeleteTool}
            trigger={
              <Button variant="destructive" disabled={loading}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            }
          />
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">
            <Info className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Activity className="mr-2 h-4 w-4" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tool Information</CardTitle>
              <CardDescription>Detailed information about this tool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{tool.description || "No description provided."}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">URL</h3>
                  {tool.url ? (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center text-blue-500 hover:text-blue-700"
                    >
                      {tool.url}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <p className="mt-1 text-gray-500">No URL provided</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1">
                    {format(new Date(tool.created_at), "PPP")}
                    <span className="text-gray-500 ml-2">
                      ({formatDistanceToNow(new Date(tool.created_at), { addSuffix: true })})
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">
                    {format(new Date(tool.updated_at), "PPP")}
                    <span className="text-gray-500 ml-2">
                      ({formatDistanceToNow(new Date(tool.updated_at), { addSuffix: true })})
                    </span>
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Long Description</h3>
                <div className="prose max-w-none dark:prose-invert">
                  {tool.long_description ? (
                    <p>{tool.long_description}</p>
                  ) : (
                    <p className="text-gray-500">No detailed description provided.</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Features</h3>
                {tool.features && tool.features.length > 0 ? (
                  <ul className="space-y-1 list-disc pl-5">
                    {tool.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent access logs for this tool</CardDescription>
            </CardHeader>
            <CardContent>
              {accessLogs.length > 0 ? (
                <div className="space-y-4">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-3 rounded-md bg-muted">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">
                            {log.user?.profile?.full_name || log.user?.email || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(log.accessed_at), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">IP: {log.ip_address || "Unknown"}</div>
                        {log.user_agent && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-full">{log.user_agent}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No recent activity for this tool.</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/admin/analytics?tool=${tool.id}`}>View Full Activity History</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Favorites</CardTitle>
              <CardDescription>Users who have favorited this tool</CardDescription>
            </CardHeader>
            <CardContent>
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="flex items-center gap-4 p-3 rounded-md bg-muted">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">
                            {favorite.user?.profile?.full_name || favorite.user?.email || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(favorite.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/users/view/${favorite.user_id}`}>View User</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No users have favorited this tool yet.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tool Settings</CardTitle>
              <CardDescription>Configure settings for this tool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                  <div>
                    <div className="font-medium">Edit Tool</div>
                    <div className="text-sm text-gray-500">Modify the tool's information and settings</div>
                  </div>
                  <Button asChild>
                    <Link href={`/admin/tools/${tool.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                  <div>
                    <div className="font-medium">View Analytics</div>
                    <div className="text-sm text-gray-500">See detailed usage statistics for this tool</div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/admin/analytics?tool=${tool.id}`}>
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <div>
                    <div className="font-medium text-red-600 dark:text-red-400">Delete Tool</div>
                    <div className="text-sm text-red-500 dark:text-red-300">
                      Permanently remove this tool from the system
                    </div>
                  </div>
                  <ConfirmDialog
                    title="Delete Tool"
                    description="Are you sure you want to delete this tool? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    onConfirm={handleDeleteTool}
                    trigger={
                      <Button variant="destructive" disabled={loading}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
