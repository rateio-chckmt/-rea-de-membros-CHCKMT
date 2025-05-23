import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import ToolsList from "@/components/admin/tools/tools-list"

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string; status?: string }
}) {
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

  // Parse query parameters
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search || ""
  const category = searchParams.category || ""
  const status = searchParams.status || ""

  return <ToolsList initialPage={page} initialSearch={search} initialCategory={category} initialStatus={status} />
}
