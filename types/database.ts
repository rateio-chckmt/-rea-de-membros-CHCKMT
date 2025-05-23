export type UserType = "user" | "moderator" | "admin"
export type PlanType = "free" | "pro" | "premium" | "custom"
export type AccountStatus = "active" | "inactive" | "suspended" | "expired"
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent"
export type ToolStatus = "online" | "maintenance" | "offline"

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  user_type: UserType
  plan_type: PlanType
  account_status: AccountStatus
  expires_at?: string
  last_login?: string
  created_at?: string
  updated_at?: string
  admin_notes?: string
  role?: string
  bio?: string
  location?: string
  job_title?: string
  company?: string
  phone?: string
  website?: string
  date_of_birth?: string
  preferences?: Record<string, any>
}

export interface Category {
  id: string
  name: string
  description?: string
  icon_name: string
  gradient_colors: {
    from: string
    to: string
  }
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Tool {
  id: string
  name: string
  description?: string
  detailed_description?: string
  category_id?: string
  icon_url?: string
  primary_color: string
  secondary_color: string
  is_active: boolean
  is_free: boolean
  min_plan_required: PlanType
  max_concurrent_users?: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface ToolAccess {
  id: string
  tool_id: string
  name: string
  url: string
  username?: string
  password?: string
  status: ToolStatus
  last_checked?: string
  order_index: number
  notes?: string
  created_at: string
  tool?: Tool
}

export interface AccessLog {
  id: string
  user_id: string
  tool_id: string
  accessed_at: string
  ip_address?: string
  user_agent?: string
  user?: Profile
  tool?: Tool
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  assigned_to?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  user?: Profile
  assigned_user?: Profile
}

export interface TicketMessage {
  id: string
  ticket_id: string
  user_id: string
  message: string
  is_admin_reply: boolean
  created_at: string
  user?: Profile
}
