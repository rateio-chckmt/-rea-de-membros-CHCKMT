import { createClient_Client } from "@/lib/supabase"
import type { Profile, Tool, ToolCategory } from "@/types/database"

// User Management API
export async function getUsers(page = 1, limit = 10, search = "", role = "") {
  const supabase = createClient_Client()

  // Calculate offset
  const offset = (page - 1) * limit

  // Start query
  let query = supabase.from("profiles").select("*, user:id(id, email, created_at, last_sign_in_at)", { count: "exact" })

  // Add filters if provided
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,user.email.ilike.%${search}%`)
  }

  if (role) {
    query = query.eq("role", role)
  }

  // Add pagination
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    throw error
  }

  return {
    users: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getUserById(userId: string) {
  const supabase = createClient_Client()

  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (profileError) {
    throw profileError
  }

  const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)

  if (userError) {
    throw userError
  }

  return { user: user.user, profile }
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  const supabase = createClient_Client()

  const { data, error } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) {
    throw error
  }

  return data
}

export async function createUser(email: string, password: string, userData: Partial<Profile>) {
  const supabase = createClient_Client()

  // Create user in auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: userData.full_name,
    },
  })

  if (authError) {
    throw authError
  }

  // Create profile
  const { data: profileData, error: profileError } = await supabase.from("profiles").upsert({
    id: authData.user.id,
    ...userData,
    updated_at: new Date().toISOString(),
  })

  if (profileError) {
    throw profileError
  }

  return { user: authData.user, profile: profileData }
}

export async function deleteUser(userId: string) {
  const supabase = createClient_Client()

  // Delete user from auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId)

  if (authError) {
    throw authError
  }

  return { success: true }
}

// Tool Management API
export async function getTools(page = 1, limit = 10, search = "", categoryId = "", status = "") {
  const supabase = createClient_Client()

  // Calculate offset
  const offset = (page - 1) * limit

  // Start query
  let query = supabase.from("tools").select("*, category:category_id(*)", { count: "exact" })

  // Add filters if provided
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  if (status) {
    query = query.eq("status", status)
  }

  // Add pagination
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    throw error
  }

  return {
    tools: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getToolById(toolId: string) {
  const supabase = createClient_Client()

  const { data, error } = await supabase.from("tools").select("*, category:category_id(*)").eq("id", toolId).single()

  if (error) {
    throw error
  }

  return data
}

export async function createTool(toolData: Partial<Tool>) {
  const supabase = createClient_Client()

  const { data, error } = await supabase
    .from("tools")
    .insert({
      ...toolData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    throw error
  }

  return data[0]
}

export async function updateTool(toolId: string, toolData: Partial<Tool>) {
  const supabase = createClient_Client()

  const { data, error } = await supabase
    .from("tools")
    .update({
      ...toolData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", toolId)
    .select()

  if (error) {
    throw error
  }

  return data[0]
}

export async function deleteTool(toolId: string) {
  const supabase = createClient_Client()

  const { error } = await supabase.from("tools").delete().eq("id", toolId)

  if (error) {
    throw error
  }

  return { success: true }
}

// Tool Categories API
export async function getToolCategories() {
  const supabase = createClient_Client()

  const { data, error } = await supabase.from("tool_categories").select("*").order("name")

  if (error) {
    throw error
  }

  return data || []
}

export async function createToolCategory(categoryData: Partial<ToolCategory>) {
  const supabase = createClient_Client()

  const { data, error } = await supabase
    .from("tool_categories")
    .insert({
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    throw error
  }

  return data[0]
}

export async function updateToolCategory(categoryId: string, categoryData: Partial<ToolCategory>) {
  const supabase = createClient_Client()

  const { data, error } = await supabase
    .from("tool_categories")
    .update({
      ...categoryData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId)
    .select()

  if (error) {
    throw error
  }

  return data[0]
}

export async function deleteToolCategory(categoryId: string) {
  const supabase = createClient_Client()

  const { error } = await supabase.from("tool_categories").delete().eq("id", categoryId)

  if (error) {
    throw error
  }

  return { success: true }
}
