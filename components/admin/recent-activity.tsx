"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ExternalLink, AlertCircle, CheckCircle, Clock } from "lucide-react"

// Dados simulados
const recentUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    registeredAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    status: "active",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@email.com",
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "pending",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@email.com",
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    status: "active",
  },
]

const problemTools = [
  {
    id: "1",
    name: "ChatGPT",
    status: "offline",
    lastCheck: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
    issue: "API não responde",
  },
  {
    id: "2",
    name: "AdSpy",
    status: "maintenance",
    lastCheck: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    issue: "Manutenção programada",
  },
  {
    id: "3",
    name: "Netflix",
    status: "slow",
    lastCheck: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    issue: "Resposta lenta",
  },
]

const recentTickets = [
  {
    id: "1",
    user: "Ana Lima",
    subject: "Não consigo acessar o ChatGPT",
    priority: "high",
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
  },
  {
    id: "2",
    user: "Carlos Mendes",
    subject: "Erro ao fazer login",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
  {
    id: "3",
    user: "Lucia Ferreira",
    subject: "Solicitação de nova ferramenta",
    priority: "low",
    status: "resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
]

export default function RecentActivity() {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Ativo" },
      pending: { variant: "secondary" as const, label: "Pendente" },
      offline: { variant: "destructive" as const, label: "Offline" },
      maintenance: { variant: "secondary" as const, label: "Manutenção" },
      slow: { variant: "outline" as const, label: "Lento" },
      open: { variant: "destructive" as const, label: "Aberto" },
      in_progress: { variant: "secondary" as const, label: "Em Andamento" },
      resolved: { variant: "default" as const, label: "Resolvido" },
      high: { variant: "destructive" as const, label: "Alta" },
      medium: { variant: "secondary" as const, label: "Média" },
      low: { variant: "outline" as const, label: "Baixa" },
    }

    const config = variants[status as keyof typeof variants] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "offline":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "active":
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Novos Usuários</TabsTrigger>
        <TabsTrigger value="tools">Problemas em Ferramentas</TabsTrigger>
        <TabsTrigger value="tickets">Tickets Recentes</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>Últimos Usuários Registrados</CardTitle>
            <CardDescription>Usuários que se registraram recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(user.status)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(user.registeredAt, { addSuffix: true, locale: ptBR })}
                    </span>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tools">
        <Card>
          <CardHeader>
            <CardTitle>Ferramentas com Problemas</CardTitle>
            <CardDescription>Ferramentas que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problemTools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(tool.status)}
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-gray-500">{tool.issue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(tool.status)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(tool.lastCheck, { addSuffix: true, locale: ptBR })}
                    </span>
                    <Button size="sm" variant="outline">
                      Verificar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tickets">
        <Card>
          <CardHeader>
            <CardTitle>Tickets de Suporte Recentes</CardTitle>
            <CardDescription>Últimas solicitações de suporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-gray-500">Por: {ticket.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(ticket.createdAt, { addSuffix: true, locale: ptBR })}
                    </span>
                    <Button size="sm" variant="outline">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
