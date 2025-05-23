"use client"

import type React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CreditCard, HardDrive, X } from "lucide-react"
import { useState } from "react"

interface AlertItem {
  id: string
  type: "warning" | "error" | "info"
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
  }
}

export default function AlertsSection() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      type: "error",
      title: "Ferramentas Offline",
      description: "3 ferramentas estão offline há mais de 24 horas",
      icon: AlertTriangle,
      action: {
        label: "Verificar",
        onClick: () => console.log("Verificar ferramentas offline"),
      },
    },
    {
      id: "2",
      type: "warning",
      title: "Assinaturas Vencendo",
      description: "12 usuários têm assinaturas vencendo nos próximos 7 dias",
      icon: CreditCard,
      action: {
        label: "Notificar",
        onClick: () => console.log("Notificar usuários"),
      },
    },
    {
      id: "3",
      type: "info",
      title: "Backup Pendente",
      description: "Último backup realizado há 2 dias",
      icon: HardDrive,
      action: {
        label: "Executar",
        onClick: () => console.log("Executar backup"),
      },
    },
  ])

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.type === "error" ? "destructive" : alert.type === "warning" ? "default" : "default"}
          className="relative"
        >
          <alert.icon className="h-4 w-4" />
          <AlertTitle className="pr-8">{alert.title}</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{alert.description}</span>
            <div className="flex items-center gap-2">
              {alert.action && (
                <Button size="sm" variant="outline" onClick={alert.action.onClick}>
                  {alert.action.label}
                </Button>
              )}
            </div>
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => dismissAlert(alert.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  )
}
