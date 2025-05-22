import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SettingsForm from "@/components/settings-form"

export default async function SettingsPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Buscar preferências do usuário
  const { data: profile } = await supabase.from("profiles").select("preferences").eq("id", session.user.id).single()

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Configurações</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Configure suas preferências de notificação e aparência.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm user={session.user} preferences={profile?.preferences} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
