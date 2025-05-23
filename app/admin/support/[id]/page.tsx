import TicketDetail from "@/components/support/ticket-detail"
import { createServerClient } from "@/lib/supabase-server"

interface TicketPageProps {
  params: {
    id: string
  }
}

export default async function TicketPage({ params }: TicketPageProps) {
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

  return (
    <div className="container mx-auto py-6">
      <TicketDetail ticketId={params.id} currentUserId={session.user.id} isAdmin={isAdmin} />
    </div>
  )
}
