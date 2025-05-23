export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          email: string
          user_type: "user" | "moderator" | "admin"
          plan_type: "free" | "pro" | "premium" | "custom"
          account_status: "active" | "inactive" | "suspended" | "expired"
          expires_at: string | null
          last_login: string | null
          created_at: string
          updated_at: string
          admin_notes: string | null
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          email: string
          user_type?: "user" | "moderator" | "admin"
          plan_type?: "free" | "pro" | "premium" | "custom"
          account_status?: "active" | "inactive" | "suspended" | "expired"
          expires_at?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
          admin_notes?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          email?: string
          user_type?: "user" | "moderator" | "admin"
          plan_type?: "free" | "pro" | "premium" | "custom"
          account_status?: "active" | "inactive" | "suspended" | "expired"
          expires_at?: string | null
          last_login?: string | null
          created_at?: string
          updated_at?: string
          admin_notes?: string | null
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string | null
          subject: string
          description: string
          priority: string
          status: string
          assigned_to: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          subject: string
          description: string
          priority?: string
          status?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          subject?: string
          description?: string
          priority?: string
          status?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          user_id: string | null
          message: string
          is_admin_reply: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          user_id?: string | null
          message: string
          is_admin_reply?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          user_id?: string | null
          message?: string
          is_admin_reply?: boolean
          created_at?: string
        }
      }
      access_logs: {
        Row: {
          id: string
          user_id: string | null
          tool_id: string | null
          accessed_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          tool_id?: string | null
          accessed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          tool_id?: string | null
          accessed_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
  }
}
