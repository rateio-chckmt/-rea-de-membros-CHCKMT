import { createClient } from "@/lib/supabase"

// Tipos necessários
type Profile = any
type SupportTicket = any
type TicketMessage = any
type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
type AccessLog = any

// Funções para gerenciar tickets de suporte
export async function getTickets(status?: TicketStatus) {
  const supabase = createClient()
  let query = supabase.from("support_tickets").select("*")

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as SupportTicket[]
}

export async function getTicketById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("support_tickets").select("*").eq("id", id).single()

  if (error) throw error
  return data as SupportTicket
}

export async function createTicket(ticket: Omit<SupportTicket, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("support_tickets").insert(ticket).select().single()

  if (error) throw error
  return data as SupportTicket
}

export async function updateTicket(id: string, updates: Partial<SupportTicket>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as SupportTicket
}

// Funções para gerenciar mensagens de tickets
export async function getTicketMessages(ticketId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as TicketMessage[]
}

export async function addTicketMessage(message: Omit<TicketMessage, "id" | "created_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("ticket_messages").insert(message).select().single()

  if (error) throw error
  return data as TicketMessage
}

// Funções para perfis
export async function getProfileById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (error) throw error
  return data as Profile
}

// Funções para logs de acesso
export async function logToolAccess(userId: string, toolId: string, ipAddress?: string, userAgent?: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("access_logs")
    .insert({
      user_id: userId,
      tool_id: toolId,
      ip_address: ipAddress,
      user_agent: userAgent,
      accessed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data as AccessLog
}

// Exportar outras funções que possam ser necessárias
export async function getProfiles() {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").select("*")

  if (error) throw error
  return data as Profile[]
}

export async function updateProfile(profile: Partial<Profile> & { id: string }) {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").update(profile).eq("id", profile.id).select().single()

  if (error) throw error
  return data as Profile
}
