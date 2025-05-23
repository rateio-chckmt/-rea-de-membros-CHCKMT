import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

interface WelcomeSectionProps {
  userName: string
  stats: {
    totalTools: number
    toolsAccessedToday: number
    accountStatus: string
  }
}

export default function WelcomeSection({ userName, stats }: WelcomeSectionProps) {
  const firstName = userName.split(" ")[0]

  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Bem-vindo, <span className="text-blue-400">{firstName}</span>!
          </h2>
          <p className="text-gray-300 mb-4">
            Acesse todas as ferramentas e recursos disponíveis para impulsionar seus resultados.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/tools">
              Explorar Ferramentas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          <div className="bg-[#1a1a1a]/50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <BarChart2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total de Ferramentas</p>
              <p className="text-xl font-bold">{stats.totalTools}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Acessadas Hoje</p>
              <p className="text-xl font-bold">{stats.toolsAccessedToday}</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-purple-500/20 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Status da Conta</p>
              <p className="text-xl font-bold">{stats.accountStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
