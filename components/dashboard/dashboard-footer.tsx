import Link from "next/link"

export default function DashboardFooter() {
  return (
    <footer className="bg-[#151515] border-t border-[#333] py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Digital Tools Platform. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/help" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Central de Ajuda
            </Link>
            <Link href="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Contato
            </Link>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-xs text-gray-500">
              Status do Sistema: <span className="text-green-500">Online</span> | Última atualização: 22/05/2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
