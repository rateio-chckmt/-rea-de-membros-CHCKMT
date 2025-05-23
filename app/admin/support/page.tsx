import TicketList from "@/components/support/ticket-list"
import { createServerClient } from "@/lib/supabase-server"

export default async function SupportPage() {
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Central de Suporte</h1>
        <p className="text-muted-foreground mt-1">Gerencie tickets de suporte e atenda às solicitações dos usuários.</p>
      </div>

      <TicketList />
    </div>
  )
}
