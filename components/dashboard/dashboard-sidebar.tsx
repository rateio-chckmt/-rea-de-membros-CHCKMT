"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  HelpCircle,
  Home,
  LayoutGrid,
  MessageSquare,
  Search,
  Star,
} from "lucide-react"

export default function DashboardSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["favorites"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const favoriteTools = [
    { id: "chatgpt", name: "ChatGPT", icon: "/icons/chatgpt.png" },
    { id: "adspy", name: "AdSpy", icon: "/icons/adspy.png" },
    { id: "semrush", name: "SEM Rush", icon: "/icons/semrush.png" },
  ]

  return (
    <aside className="w-64 bg-[#151515] border-r border-[#333] hidden md:block overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-500 font-medium mb-3">Menu Principal</p>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-[#1a1a1a] rounded-md"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              Ferramentas
            </Link>
            <Link
              href="/my-access"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
            >
              <Star className="h-4 w-4" />
              Meus Acessos
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Suporte
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("favorites")}
          >
            <p className="text-xs uppercase text-gray-500 font-medium">Favoritos</p>
            {expandedSections.includes("favorites") ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>

          {expandedSections.includes("favorites") && (
            <div className="space-y-1">
              {favoriteTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
                >
                  <div className="relative w-4 h-4">
                    <Image src={tool.icon || "/placeholder.svg"} alt={tool.name} fill className="object-contain" />
                  </div>
                  {tool.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-xs text-blue-400 hover:text-blue-300 hover:bg-transparent px-3 py-1"
              >
                Gerenciar favoritos
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => toggleSection("categories")}
          >
            <p className="text-xs uppercase text-gray-500 font-medium">Categorias</p>
            {expandedSections.includes("categories") ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>

          {expandedSections.includes("categories") && (
            <div className="space-y-1">
              <Link
                href="/tools/category/ads"
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4" />
                  Mineração de Anúncios
                </div>
                <Badge variant="outline" className="text-xs">
                  7
                </Badge>
              </Link>
              <Link
                href="/tools/category/seo"
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-4 w-4" />
                  Ferramentas de SEO
                </div>
                <Badge variant="outline" className="text-xs">
                  7
                </Badge>
              </Link>
              <Link
                href="/tools/category/ai"
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="h-4 w-4" />
                  Inteligências Artificiais
                </div>
                <Badge variant="outline" className="text-xs">
                  7
                </Badge>
              </Link>
              <Link
                href="/tools/category/products"
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4" />
                  Mineração de Produtos
                </div>
                <Badge variant="outline" className="text-xs">
                  6
                </Badge>
              </Link>
              <Link
                href="/tools/category/courses"
                className="flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4" />
                  Cursos
                </div>
                <Badge variant="outline" className="text-xs">
                  1
                </Badge>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-xs text-blue-400 hover:text-blue-300 hover:bg-transparent px-3 py-1"
              >
                Ver todas categorias
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Precisa de ajuda?</p>
            <p className="text-xs text-gray-400 mb-3">Nossa equipe está disponível para ajudar com qualquer dúvida.</p>
            <Button size="sm" variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contatar Suporte
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
