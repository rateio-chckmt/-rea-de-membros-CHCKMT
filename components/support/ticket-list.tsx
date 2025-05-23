"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { SupportTicket, TicketStatus } from "@/types/database"
import { getTickets } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Plus, RefreshCw } from "lucide-react"

export default function TicketList() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TicketStatus | "all">("all")
  const router = useRouter()

  useEffect(() => {
    loadTickets()
  }, [activeTab])

  async function loadTickets() {
    setLoading(true)
    try {
      const status = activeTab !== "all" ? (activeTab as TicketStatus) : undefined
      const data = await getTickets(status)
      setTickets(data)
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  function getPriorityBadge(priority: string) {
    switch (priority) {
      case "low":
        return <Badge variant="outline">Baixa</Badge>
      case "medium":
        return <Badge variant="secondary">Média</Badge>
      case "high":
        return <Badge variant="default">Alta</Badge>
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Aberto</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-500">Em Progresso</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolvido</Badge>
      case "closed":
        return <Badge variant="outline">Fechado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tickets de Suporte</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadTickets}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" onClick={() => router.push("/admin/support/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TicketStatus | "all")}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="open">Abertos</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
            <TabsTrigger value="closed">Fechados</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum ticket encontrado</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Não há tickets {activeTab !== "all" ? `com status "${activeTab}"` : ""} no momento.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-xs">{ticket.id.split("-")[0]}</TableCell>
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{formatDate(ticket.created_at)}</TableCell>
                        <TableCell>{formatDate(ticket.updated_at)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/support/${ticket.id}`)}>
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
