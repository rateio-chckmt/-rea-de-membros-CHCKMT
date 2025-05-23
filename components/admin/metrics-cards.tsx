"use client"

import type React from "react"

import { TrendingUp, TrendingDown, Users, PenToolIcon as Tool, Activity, Headphones } from "lucide-react"

interface MetricsCardsProps {
  metrics: {
    activeUsers: number
    toolsOnline: number
    accessesToday: number
    supportTickets: number
  }
}

interface MetricCardProps {
  title: string
  value: number
  change: number
  changeType: "increase" | "decrease"
  icon: React.ComponentType<{ className?: string }>
  color: string
}

function MetricCard({ title, value, change, changeType, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            {changeType === "increase" ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Usuários Ativos"
        value={metrics.activeUsers}
        change={12.5}
        changeType="increase"
        icon={Users}
        color="bg-blue-500"
      />
      <MetricCard
        title="Ferramentas Online"
        value={metrics.toolsOnline}
        change={-2.1}
        changeType="decrease"
        icon={Tool}
        color="bg-green-500"
      />
      <MetricCard
        title="Acessos Hoje"
        value={metrics.accessesToday}
        change={8.3}
        changeType="increase"
        icon={Activity}
        color="bg-purple-500"
      />
      <MetricCard
        title="Tickets Suporte"
        value={metrics.supportTickets}
        change={-15.2}
        changeType="decrease"
        icon={Headphones}
        color="bg-orange-500"
      />
    </div>
  )
}
