"use client"

import { useState, useEffect } from "react"
import { getToolUsageData } from "@/lib/analytics-utils"
import type { ToolUsageData } from "@/types/analytics"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Loader2 } from "lucide-react"

interface ToolUsageChartProps {
  limit?: number
}

export default function ToolUsageChart({ limit = 10 }: ToolUsageChartProps) {
  const [data, setData] = useState<ToolUsageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const toolUsageData = await getToolUsageData(limit)
        setData(toolUsageData)
      } catch (error) {
        console.error("Erro ao buscar dados de uso de ferramentas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

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
        <p className="text-gray-500">Nenhum dado de uso disponível</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="toolName" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip formatter={(value, name) => [value, "Acessos"]} labelFormatter={(label) => `Ferramenta: ${label}`} />
        <Bar dataKey="count" name="Acessos">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.categoryColor || "#0093E9"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
