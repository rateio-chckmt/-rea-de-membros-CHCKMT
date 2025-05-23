import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"
import ToolForm from "@/components/admin/tools/tool-form"

export default async function EditToolPage({ params }: { params: { id: string } }) {
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

  return <ToolForm toolId={params.id} initialData={toolData} />
}
