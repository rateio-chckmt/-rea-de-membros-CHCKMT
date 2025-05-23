"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Dados simulados para os gráficos
const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Fev", users: 145 },
  { month: "Mar", users: 180 },
  { month: "Abr", users: 220 },
  { month: "Mai", users: 280 },
  { month: "Jun", users: 350 },
]

const topToolsData = [
  { name: "ChatGPT", accesses: 1250 },
  { name: "AdSpy", accesses: 980 },
  { name: "SEM Rush", accesses: 850 },
  { name: "Canva", accesses: 720 },
  { name: "Netflix", accesses: 650 },
  { name: "Figma", accesses: 580 },
  { name: "Notion", accesses: 520 },
  { name: "Spotify", accesses: 480 },
]

const toolsStatusData = [
  { name: "Online", value: 75, color: "#10b981" },
  { name: "Manutenção", value: 8, color: "#f59e0b" },
  { name: "Offline", value: 4, color: "#ef4444" },
]

export default function ChartsSection() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Crescimento de Usuários</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas Populares</TabsTrigger>
          <TabsTrigger value="status">Status das Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Novos usuários registrados nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Mais Acessadas</CardTitle>
              <CardDescription>Top 8 ferramentas por número de acessos este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topToolsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="accesses" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Status das Ferramentas</CardTitle>
              <CardDescription>Distribuição atual do status das ferramentas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={toolsStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {toolsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
