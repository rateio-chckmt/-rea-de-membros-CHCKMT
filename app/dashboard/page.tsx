import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (!profile) {
    redirect("/")
  }

  // Get categories and tools
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("order_index")

  const { data: tools } = await supabase
    .from("tools")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_active", true)
    .order("name")

  // Get recent access logs for this user
  const { data: recentAccess } = await supabase
    .from("access_logs")
    .select(`
      *,
      tool:tools(*)
    `)
    .eq("user_id", session.user.id)
    .order("accessed_at", { ascending: false })
    .limit(5)

  // Get user's support tickets
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <DashboardContent
      profile={profile}
      categories={categories || []}
      tools={tools || []}
      recentAccess={recentAccess || []}
      tickets={tickets || []}
    />
  )
}
