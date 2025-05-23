"use client"

import { useState, useEffect } from "react"
import { getUserActivityData } from "@/lib/analytics-utils"
import type { UserActivityData } from "@/types/analytics"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

interface UserActivityChartProps {
  days?: number
}

export default function UserActivityChart({ days = 30 }: UserActivityChartProps) {
  const [data, setData] = useState<UserActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityData = await getUserActivityData(days)
        setData(activityData)
      } catch (error) {
        console.error("Erro ao buscar dados de atividade de usuários:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Nenhum dado de atividade disponível</p>
      </div>
    )
  }

  // Formatar datas para exibição
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [value, name === "activeUsers" ? "Usuários Ativos" : "Novos Usuários"]}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Legend formatter={(value) => (value === "activeUsers" ? "Usuários Ativos" : "Novos Usuários")} />
        <Line
          type="monotone"
          dataKey="activeUsers"
          name="activeUsers"
          stroke="#0093E9"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line type="monotone" dataKey="newUsers" name="newUsers" stroke="#00C49F" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
