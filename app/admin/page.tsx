import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Verificar se o usuário é admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Buscar métricas do dashboard
  const [usersCount, toolsCount, accessesToday] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }),
    // Simular contagem de ferramentas (você pode criar uma tabela tools)
    Promise.resolve({ count: 87 }),
    // Simular acessos hoje (você pode criar uma tabela access_logs)
    Promise.resolve({ count: 234 }),
  ])

  const metrics = {
    activeUsers: usersCount.count || 0,
    toolsOnline: toolsCount.count || 0,
    accessesToday: accessesToday.count || 0,
    supportTickets: 12, // Simular tickets de suporte
  }

  return <AdminDashboard user={session.user} metrics={metrics} />
}
