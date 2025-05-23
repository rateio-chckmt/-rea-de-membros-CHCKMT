import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import UserForm from "@/components/admin/users/user-form"

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Verify admin role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Get user data
  const { data: userData } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  if (!userData) {
    redirect("/admin/users")
  }

  return <UserForm userId={params.id} initialData={userData} />
}
