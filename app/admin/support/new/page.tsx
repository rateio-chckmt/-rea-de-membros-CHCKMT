import NewTicketForm from "@/components/support/new-ticket-form"
import { createServerClient } from "@/lib/supabase-server"

export default async function NewTicketPage() {
  const supabase = createServerClient()

  // Verificar se o usuário está autenticado
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
    <div className="container mx-auto py-6">
      <NewTicketForm userId={session.user.id} />
    </div>
  )
}
