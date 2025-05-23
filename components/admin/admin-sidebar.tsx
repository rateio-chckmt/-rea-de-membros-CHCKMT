"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Users,
  Settings,
  Home,
  LayoutDashboard,
  LogOut,
  PenToolIcon as Tool,
  FileText,
  Bell,
  HelpCircle,
} from "lucide-react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Ferramentas",
    href: "/admin/tools",
    icon: Tool,
  },
  {
    title: "Relatórios",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Notificações",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Configurações",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Suporte",
    href: "/admin/support",
    icon: HelpCircle,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5" />
          <span>Admin Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {sidebarLinks.map((link, index) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Link
          href="/dashboard"
          className="flex w-full items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-all hover:bg-gray-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Voltar ao Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
