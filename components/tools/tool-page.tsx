"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Star, Clock, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ToolPageProps {
  tool: {
    id: string
    name: string
    description: string
    longDescription: string
    icon: string
    url: string
    features: string[]
  }
}

export default function ToolPage({ tool }: ToolPageProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const router = useRouter()

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16">
                <Image
                  src={tool.icon || "/placeholder.svg"}
                  alt={tool.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                <p className="text-gray-400">{tool.description}</p>
              </div>
            </div>

            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Sobre a Ferramenta</h2>
                <p className="text-gray-300 mb-6">{tool.longDescription}</p>

                <h3 className="text-lg font-bold mb-3">Principais Recursos</h3>
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Tutoriais Recentes</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Guia para Iniciantes</p>
                        <p className="text-sm text-gray-400">Atualizado há 2 dias</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Recursos Avançados</p>
                        <p className="text-sm text-gray-400">Atualizado há 1 semana</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1a1a1a] border-[#333]">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Comunidade</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <Share2 className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Grupo de Discussão</p>
                        <p className="text-sm text-gray-400">2.5k membros</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-full">
                        <Share2 className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Recursos Compartilhados</p>
                        <p className="text-sm text-gray-400">150+ recursos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardContent className="p-6">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 mb-4 h-12 text-base"
                  onClick={() => window.open(tool.url, "_blank")}
                >
                  Acessar Ferramenta
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex gap-2 mb-6">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#333] hover:bg-[#252525]"
                    onClick={handleBookmark}
                  >
                    <Star className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    {isBookmarked ? "Favoritado" : "Favoritar"}
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#333] hover:bg-[#252525]">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Categoria</p>
                    <Badge variant="outline">Inteligência Artificial</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Último acesso</p>
                    <p className="text-sm">Há 2 dias</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Popularidade</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm">(4.0)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#333]">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Ferramentas Relacionadas</h3>
                <div className="space-y-3">
                  {["gemini", "claude", "v0-dev"].includes(tool.id) ? (
                    <>
                      <Link href="/tools/chatgpt" className="flex items-center gap-3 hover:bg-[#252525] p-2 rounded-lg">
                        <Image
                          src="/chatgpt-logo-inspired.png"
                          alt="ChatGPT"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <span>Chat GPT</span>
                      </Link>
                      <Link href="/tools/gemini" className="flex items-center gap-3 hover:bg-[#252525] p-2 rounded-lg">
                        <Image
                          src="/placeholder.svg?height=32&width=32&query=Gemini Google logo"
                          alt="Gemini"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <span>Gemini</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/tools/canva-pro"
                        className="flex items-center gap-3 hover:bg-[#252525] p-2 rounded-lg"
                      >
                        <Image
                          src="/canva-pro-logo.png"
                          alt="Canva PRO"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <span>Canva PRO</span>
                      </Link>
                      <Link href="/tools/capcut" className="flex items-center gap-3 hover:bg-[#252525] p-2 rounded-lg">
                        <Image
                          src="/placeholder.svg?height=32&width=32&query=CapCut logo"
                          alt="CapCut"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <span>CapCut</span>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
