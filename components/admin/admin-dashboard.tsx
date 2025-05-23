"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import AdminSidebar from "./admin-sidebar"
import AdminHeader from "./admin-header"
import MetricsCards from "./metrics-cards"
import ChartsSection from "./charts-section"
import QuickActions from "./quick-actions"
import RecentActivity from "./recent-activity"
import AlertsSection from "./alerts-section"

interface AdminDashboardProps {
  user: User
  metrics: {
    activeUsers: number
    toolsOnline: number
    accessesToday: number
    supportTickets: number
  }
}

export default function AdminDashboard({ user, metrics }: AdminDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <AdminHeader user={user} />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Alertas */}
            <AlertsSection />

            {/* Cards de Métricas */}
            <MetricsCards metrics={metrics} />

            {/* Gráficos e Ações Rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartsSection />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Atividade Recente */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  )
}
