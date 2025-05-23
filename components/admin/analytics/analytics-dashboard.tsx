"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnalyticsSummary } from "@/lib/analytics-utils"
import { Loader2, Users, BarChart3, TrendingUp, Calendar } from "lucide-react"
import type { AnalyticsSummary } from "@/types/analytics"
import ToolUsageChart from "./tool-usage-chart"
import UserActivityChart from "./user-activity-chart"
import CategoryDistributionChart from "./category-distribution-chart"
import TopUsersTable from "./top-users-table"

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAnalyticsSummary()
        setSummary(data)
      } catch (error) {
        console.error("Erro ao buscar resumo de analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-gray-500">Visualize estatísticas e métricas da plataforma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">+{summary?.newUsersThisWeek || 0} esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ferramentas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalTools || 0}</div>
            <p className="text-xs text-muted-foreground">
              Em {summary?.totalTools ? Math.ceil(summary.totalTools / 5) : 0} categorias
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Acessos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalAccesses || 0}</div>
            <p className="text-xs text-muted-foreground">{summary?.activeUsersToday || 0} usuários ativos hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ferramenta Popular</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate" title={summary?.popularTool.name || ""}>
              {summary?.popularTool.name || "Nenhuma"}
            </div>
            <p className="text-xs text-muted-foreground">{summary?.popularTool.accessCount || 0} acessos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tools">Uso de Ferramentas</TabsTrigger>
          <TabsTrigger value="users">Atividade de Usuários</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Ferramentas</CardTitle>
                <CardDescription>As ferramentas mais acessadas na plataforma</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ToolUsageChart limit={5} />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Ferramentas por categoria</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <CategoryDistributionChart />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Atividade de Usuários</CardTitle>
              <CardDescription>Usuários ativos e novos registros nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <UserActivityChart days={30} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Usuários Mais Ativos</CardTitle>
              <CardDescription>Usuários com mais acessos na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <TopUsersTable limit={5} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Uso de Ferramentas</CardTitle>
              <CardDescription>Estatísticas detalhadas de uso das ferramentas</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ToolUsageChart limit={10} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Atividade de Usuários</CardTitle>
              <CardDescription>Usuários ativos e novos registros</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <UserActivityChart days={60} />
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Usuários Mais Ativos</CardTitle>
              <CardDescription>Usuários com mais acessos na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <TopUsersTable limit={10} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Análise de ferramentas por categoria</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <CategoryDistributionChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
