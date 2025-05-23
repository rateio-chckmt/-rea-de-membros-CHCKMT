"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTicket } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, RefreshCw, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NewTicketFormProps {
  userId: string
}

export default function NewTicketForm({ userId }: NewTicketFormProps) {
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<string>("medium")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!subject.trim() || !description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const ticket = await createTicket({
        user_id: userId,
        subject,
        description,
        priority: priority as any,
        status: "open",
      })

      toast({
        title: "Ticket criado",
        description: "Seu ticket foi criado com sucesso.",
      })

      router.push(`/admin/support/${ticket.id}`)
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Erro ao criar ticket",
        description: "Não foi possível criar o ticket. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push("/admin/support")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para a lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Novo Ticket de Suporte</CardTitle>
          <CardDescription>Preencha o formulário abaixo para criar um novo ticket de suporte.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Digite o assunto do ticket"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva seu problema ou solicitação em detalhes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Criar Ticket
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
