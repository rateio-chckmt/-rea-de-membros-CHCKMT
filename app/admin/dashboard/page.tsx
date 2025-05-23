import SupportDashboard from "@/components/admin/support-dashboard"
import { createServerClient } from "@/lib/supabase-server"

export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  // Verificar se o usuário está autenticado e é admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    )
  }

  // Verificar se o usuário é admin
  const { data: profile } = await supabase.from("profiles").select("role, user_type").eq("id", session.user.id).single()

  const isAdmin = profile?.role === "admin" || profile?.user_type === "admin"

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-1">Gerencie usuários, ferramentas e monitore o sistema.</p>
      </div>

      <SupportDashboard />
    </div>
  )
}
