import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"

const supabase = createServerComponentClient<Database>({ cookies })

export default async function Dashboard() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <p>You are now logged in!</p>
    </div>
  )
}
