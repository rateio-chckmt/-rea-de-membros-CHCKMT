"use client"

import { Plus, PenToolIcon as Tool, Mail, RefreshCw, Users, FileText, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Adicionar Usuário",
      description: "Criar nova conta de usuário",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => router.push("/admin/users/add"),
    },
    {
      title: "Nova Ferramenta",
      description: "Adicionar ferramenta ao catálogo",
      icon: Tool,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => router.push("/admin/tools/add"),
    },
    {
      title: "Notificação Geral",
      description: "Enviar email para todos os usuários",
      icon: Mail,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => router.push("/admin/system/notifications"),
    },
    {
      title: "Verificar Status",
      description: "Checar status das ferramentas",
      icon: RefreshCw,
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => router.push("/admin/tools"),
    },
  ]

  const shortcuts = [
    {
      title: "Gerenciar Usuários",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Gerenciar Ferramentas",
      icon: Tool,
      href: "/admin/tools",
    },
    {
      title: "Categorias",
      icon: FileText,
      href: "/admin/tools/categories",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/admin/system/settings",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            className={`flex flex-col items-center justify-center p-4 rounded-md shadow-sm ${action.color} text-white`}
            onClick={action.onClick}
          >
            <action.icon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{action.title}</span>
            <span className="text-xs">{action.description}</span>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-medium">Atalhos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.title}
            href={shortcut.href}
            className="flex flex-col items-center justify-center p-4 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200"
          >
            <shortcut.icon className="h-6 w-6 mb-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{shortcut.title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
