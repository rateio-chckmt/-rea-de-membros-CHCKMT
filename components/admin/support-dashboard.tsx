"use client"

import { useState, useEffect } from "react"
import type { SupportTicket } from "@/types/database"
import { getTickets } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, MessageSquare, RefreshCw } from "lucide-react"

export default function SupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0,
  })

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    setLoading(true)
    try {
      const data = await getTickets()
      setTickets(data)

      // Calcular estatísticas
      const newStats = {
        total: data.length,
        open: data.filter((t) => t.status === "open").length,
        inProgress: data.filter((t) => t.status === "in_progress").length,
        resolved: data.filter((t) => t.status === "resolved").length,
        closed: data.filter((t) => t.status === "closed").length,
        urgent: data.filter((t) => t.priority === "urgent").length,
        high: data.filter((t) => t.priority === "high").length,
        medium: data.filter((t) => t.priority === "medium").length,
        low: data.filter((t) => t.priority === "low").length,
      }

      setStats(newStats)
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral do Suporte</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Abertos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{stats.open}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Em Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{stats.inProgress}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolvidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{stats.resolved}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Status</CardTitle>
            <CardDescription>Distribuição de tickets por status atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  <span>Abertos</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.open}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.open / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                  <span>Em Progresso</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.inProgress}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span>Resolvidos</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.resolved}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
                  <span>Fechados</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.closed}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets por Prioridade</CardTitle>
            <CardDescription>Distribuição de tickets por nível de prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  <span>Urgente</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.urgent}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.urgent / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                  <span>Alta</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.high}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  <span>Média</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.medium}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.medium / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  <span>Baixa</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{stats.low}</span>
                  <Badge variant="outline" className="ml-2">
                    {stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
