import { createClient_Client } from "@/lib/supabase"
import type {
  ToolUsageData,
  UserActivityData,
  CategoryDistributionData,
  TopUserData,
  AnalyticsSummary,
} from "@/types/analytics"

// Função para obter o resumo de analytics
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = createClient_Client()

  // Total de usuários
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Total de ferramentas
  const { count: totalTools } = await supabase.from("tools").select("*", { count: "exact", head: true })

  // Total de acessos
  const { count: totalAccesses } = await supabase.from("access_logs").select("*", { count: "exact", head: true })

  // Usuários ativos hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: activeUsersToday } = await supabase
    .from("access_logs")
    .select("user_id", { count: "exact", head: true })
    .gte("accessed_at", today.toISOString())
    .distinctOn("user_id")

  // Novos usuários esta semana
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { count: newUsersThisWeek } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo.toISOString())

  // Ferramenta mais popular
  const { data: popularToolData } = await supabase
    .from("access_logs")
    .select("tool_id, tools:tool_id(name)")
    .order("accessed_at", { ascending: false })
    .limit(100)

  // Contagem de acessos por ferramenta
  const toolAccessCount: Record<string, { id: string; name: string; count: number }> = {}

  popularToolData?.forEach((log) => {
    if (!log.tool_id || !log.tools) return

    const toolId = log.tool_id
    const toolName = (log.tools as any).name

    if (!toolAccessCount[toolId]) {
      toolAccessCount[toolId] = { id: toolId, name: toolName, count: 0 }
    }

    toolAccessCount[toolId].count++
  })

  // Encontrar a ferramenta mais popular
  let popularTool = { id: "", name: "Nenhuma", accessCount: 0 }

  Object.values(toolAccessCount).forEach((tool) => {
    if (tool.count > popularTool.accessCount) {
      popularTool = { id: tool.id, name: tool.name, accessCount: tool.count }
    }
  })

  return {
    totalUsers: totalUsers || 0,
    totalTools: totalTools || 0,
    totalAccesses: totalAccesses || 0,
    activeUsersToday: activeUsersToday || 0,
    newUsersThisWeek: newUsersThisWeek || 0,
    popularTool,
  }
}

// Função para obter dados de uso das ferramentas
export async function getToolUsageData(limit = 10): Promise<ToolUsageData[]> {
  const supabase = createClient_Client()

  // Buscar contagem de acessos por ferramenta
  const { data: accessCounts, error: accessError } = await supabase
    .from("access_logs")
    .select("tool_id, count")
    .select("tool_id, count(*)")
    .groupBy("tool_id")
    .order("count", { ascending: false })
    .limit(limit)

  if (accessError) {
    console.error("Erro ao buscar contagem de acessos:", accessError)
    return []
  }

  // Buscar detalhes das ferramentas
  const toolIds = accessCounts.map((item) => item.tool_id)

  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("id, name, category_id, category:category_id(name, gradient)")
    .in("id", toolIds)

  if (toolsError) {
    console.error("Erro ao buscar detalhes das ferramentas:", toolsError)
    return []
  }

  // Calcular total de acessos
  const totalAccesses = accessCounts.reduce((sum, item) => sum + Number.parseInt(item.count as any), 0)

  // Mapear dados para o formato esperado
  const toolUsageData: ToolUsageData[] = accessCounts.map((accessItem) => {
    const tool = tools.find((t) => t.id === accessItem.tool_id)
    const count = Number.parseInt(accessItem.count as any)
    const percentage = totalAccesses > 0 ? (count / totalAccesses) * 100 : 0

    return {
      toolId: accessItem.tool_id,
      toolName: tool?.name || "Ferramenta Desconhecida",
      count,
      percentage,
      categoryName: tool?.category?.name,
      categoryColor: tool?.category?.gradient?.split(",")[0].split(" ")[0] || "#0093E9",
    }
  })

  return toolUsageData
}

// Função para obter dados de atividade dos usuários
export async function getUserActivityData(days = 30): Promise<UserActivityData[]> {
  const supabase = createClient_Client()

  // Calcular data inicial
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  // Gerar array de datas para o período
  const dateArray: UserActivityData[] = []
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    dateArray.push({
      date: date.toISOString().split("T")[0],
      activeUsers: 0,
      newUsers: 0,
    })
  }

  // Buscar usuários ativos por dia
  const { data: activeUsersData, error: activeError } = await supabase
    .from("access_logs")
    .select("accessed_at, user_id")
    .gte("accessed_at", startDate.toISOString())
    .order("accessed_at", { ascending: true })

  if (activeError) {
    console.error("Erro ao buscar usuários ativos:", activeError)
    return dateArray
  }

  // Contar usuários ativos por dia
  const activeUsersByDay: Record<string, Set<string>> = {}

  activeUsersData.forEach((log) => {
    const date = new Date(log.accessed_at).toISOString().split("T")[0]

    if (!activeUsersByDay[date]) {
      activeUsersByDay[date] = new Set()
    }

    activeUsersByDay[date].add(log.user_id)
  })

  // Buscar novos usuários por dia
  const { data: newUsersData, error: newUsersError } = await supabase
    .from("profiles")
    .select("id, created_at")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true })

  if (newUsersError) {
    console.error("Erro ao buscar novos usuários:", newUsersError)
    return dateArray
  }

  // Contar novos usuários por dia
  const newUsersByDay: Record<string, number> = {}

  newUsersData.forEach((user) => {
    const date = new Date(user.created_at).toISOString().split("T")[0]

    if (!newUsersByDay[date]) {
      newUsersByDay[date] = 0
    }

    newUsersByDay[date]++
  })

  // Preencher o array de datas com os dados
  dateArray.forEach((item) => {
    item.activeUsers = activeUsersByDay[item.date]?.size || 0
    item.newUsers = newUsersByDay[item.date] || 0
  })

  return dateArray
}

// Função para obter distribuição de ferramentas por categoria
export async function getCategoryDistribution(): Promise<CategoryDistributionData[]> {
  const supabase = createClient_Client()

  // Buscar categorias
  const { data: categories, error: categoriesError } = await supabase
    .from("tool_categories")
    .select("id, name, gradient")

  if (categoriesError) {
    console.error("Erro ao buscar categorias:", categoriesError)
    return []
  }

  // Buscar contagem de ferramentas por categoria
  const { data: toolCounts, error: toolsError } = await supabase
    .from("tools")
    .select("category_id, count(*)")
    .groupBy("category_id")

  if (toolsError) {
    console.error("Erro ao buscar contagem de ferramentas:", toolsError)
    return []
  }

  // Calcular total de ferramentas
  const totalTools = toolCounts.reduce((sum, item) => sum + Number.parseInt(item.count as any), 0)

  // Mapear dados para o formato esperado
  const categoryData: CategoryDistributionData[] = categories.map((category) => {
    const toolCount = toolCounts.find((t) => t.category_id === category.id)
    const count = toolCount ? Number.parseInt(toolCount.count as any) : 0
    const percentage = totalTools > 0 ? (count / totalTools) * 100 : 0

    return {
      categoryId: category.id,
      categoryName: category.name,
      toolCount: count,
      percentage,
      color: category.gradient.split(",")[0].split(" ")[0] || "#0093E9",
    }
  })

  return categoryData.sort((a, b) => b.toolCount - a.toolCount)
}

// Função para obter os usuários mais ativos
export async function getTopUsers(limit = 5): Promise<TopUserData[]> {
  const supabase = createClient_Client()

  // Buscar contagem de acessos por usuário
  const { data: accessCounts, error: accessError } = await supabase
    .from("access_logs")
    .select("user_id, count(*)")
    .groupBy("user_id")
    .order("count", { ascending: false })
    .limit(limit)

  if (accessError) {
    console.error("Erro ao buscar contagem de acessos por usuário:", accessError)
    return []
  }

  // Buscar detalhes dos usuários
  const userIds = accessCounts.map((item) => item.user_id)

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds)

  if (profilesError) {
    console.error("Erro ao buscar perfis dos usuários:", profilesError)
    return []
  }

  // Buscar último acesso de cada usuário
  const { data: lastAccesses, error: lastAccessError } = await supabase
    .from("access_logs")
    .select("user_id, accessed_at")
    .in("user_id", userIds)
    .order("accessed_at", { ascending: false })

  if (lastAccessError) {
    console.error("Erro ao buscar último acesso dos usuários:", lastAccessError)
    return []
  }

  // Mapear último acesso por usuário
  const lastAccessByUser: Record<string, string> = {}

  lastAccesses.forEach((access) => {
    if (!lastAccessByUser[access.user_id]) {
      lastAccessByUser[access.user_id] = access.accessed_at
    }
  })

  // Mapear dados para o formato esperado
  const topUsers: TopUserData[] = accessCounts.map((accessItem) => {
    const profile = profiles.find((p) => p.id === accessItem.user_id)

    return {
      userId: accessItem.user_id,
      userName: profile?.full_name || "Usuário Desconhecido",
      accessCount: Number.parseInt(accessItem.count as any),
      lastAccess: lastAccessByUser[accessItem.user_id] || "Desconhecido",
      avatarUrl: profile?.avatar_url,
    }
  })

  return topUsers
}
