import { createClient } from "@/lib/supabase"
import { createServerClient } from "@/lib/supabase-server"

// Verificar se o usuário é admin (client-side)
export const isAdmin = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  return profile?.user_type === "admin"
}

// Verificar se o usuário é admin (server-side)
export const isAdminServer = async () => {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  return profile?.user_type === "admin"
}

// Obter o plano do usuário
export const getUserPlan = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type, account_status, expires_at")
    .eq("id", user.id)
    .single()

  return profile
}

// Verificar se o usuário tem acesso a uma ferramenta
export const hasToolAccess = async (toolId: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  // Verificar o plano do usuário
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type, account_status")
    .eq("id", user.id)
    .single()

  if (!profile || profile.account_status !== "active") return false

  // Verificar os requisitos da ferramenta
  const { data: tool } = await supabase.from("tools").select("min_plan_required, is_free").eq("id", toolId).single()

  if (!tool) return false

  // Se a ferramenta é gratuita, todos têm acesso
  if (tool.is_free) return true

  // Verificar se o plano do usuário é suficiente
  const planHierarchy = ["free", "pro", "premium", "custom"]
  const userPlanIndex = planHierarchy.indexOf(profile.plan_type)
  const requiredPlanIndex = planHierarchy.indexOf(tool.min_plan_required)

  return userPlanIndex >= requiredPlanIndex
}
