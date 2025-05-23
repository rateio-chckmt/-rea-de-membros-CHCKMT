import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import ToolView from "@/components/admin/tools/tool-view"

export default async function ViewToolPage({ params }: { params: { id: string } }) {
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

  // Get tool data
  const { data: toolData } = await supabase
    .from("tools")
    .select("*, category:category_id(*)")
    .eq("id", params.id)
    .single()

  if (!toolData) {
    redirect("/admin/tools")
  }

  // Get access logs for this tool
  const { data: accessLogs } = await supabase
    .from("access_logs")
    .select("*, user:user_id(id, email, profile:profiles(full_name))")
    .eq("tool_id", params.id)
    .order("accessed_at", { ascending: false })
    .limit(10)

  // Get user favorites for this tool
  const { data: favorites } = await supabase
    .from("user_favorites")
    .select("*, user:user_id(id, email, profile:profiles(full_name))")
    .eq("tool_id", params.id)
    .limit(10)

  return <ToolView tool={toolData} accessLogs={accessLogs || []} favorites={favorites || []} />
}
