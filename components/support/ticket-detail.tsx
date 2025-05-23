"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { SupportTicket, TicketMessage, Profile } from "@/types/database"
import { getTicketById, getTicketMessages, addTicketMessage, updateTicket, getProfileById } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, MessageSquare, RefreshCw, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TicketDetailProps {
  ticketId: string
  currentUserId: string
  isAdmin: boolean
}

export default function TicketDetail({ ticketId, currentUserId, isAdmin }: TicketDetailProps) {
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadTicketData()
  }, [ticketId])

  async function loadTicketData() {
    setLoading(true)
    try {
      const ticketData = await getTicketById(ticketId)
      setTicket(ticketData)

      const messagesData = await getTicketMessages(ticketId)
      setMessages(messagesData)

      const userData = await getProfileById(ticketData.user_id)
      setUserProfile(userData)
    } catch (error) {
      console.error("Error loading ticket data:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do ticket.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !ticket) return

    setSubmitting(true)
    try {
      const message = await addTicketMessage({
        ticket_id: ticketId,
        user_id: currentUserId,
        message: newMessage,
        is_admin_reply: isAdmin,
      })

      setMessages([...messages, message])
      setNewMessage("")

      // Se for uma resposta de admin e o ticket estiver aberto, atualizar para "em progresso"
      if (isAdmin && ticket.status === "open") {
        const updatedTicket = await updateTicket(ticketId, { status: "in_progress" })
        setTicket(updatedTicket)
      }

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!ticket) return

    try {
      const updates: Partial<SupportTicket> = {
        status: newStatus as any,
      }

      // Se estiver marcando como resolvido, adicionar data de resolução
      if (newStatus === "resolved") {
        updates.resolved_at = new Date().toISOString()
      }

      const updatedTicket = await updateTicket(ticketId, updates)
      setTicket(updatedTicket)

      toast({
        title: "Status atualizado",
        description: `O ticket foi atualizado para "${newStatus}".`,
      })
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do ticket.",
        variant: "destructive",
      })
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Ticket não encontrado</h3>
        <p className="text-sm text-muted-foreground mt-1">
          O ticket solicitado não existe ou você não tem permissão para visualizá-lo.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/support")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a lista
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/admin/support")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a lista
        </Button>

        {isAdmin && (
          <Select value={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{ticket.subject}</CardTitle>
              <CardDescription className="mt-1">Criado em {formatDate(ticket.created_at)}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getPriorityBadge(ticket.priority)}
              {getStatusBadge(ticket.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProfile && (
              <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                <Avatar>
                  <AvatarImage src={userProfile.avatar_url || ""} />
                  <AvatarFallback>
                    {userProfile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{userProfile.full_name}</h4>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                </div>
              </div>
            )}

            <div className="p-4 border rounded-lg">
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>

            <Separator />

            <h3 className="font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Mensagens
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma mensagem ainda. Seja o primeiro a responder!
                </p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.is_admin_reply ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              disabled={ticket.status === "closed"}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || submitting || ticket.status === "closed"}
              >
                {submitting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Enviar
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
