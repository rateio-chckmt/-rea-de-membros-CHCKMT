import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Verificar se a sessão existe e não está expirada
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // Se houver erro na sessão, limpar cookies e redirecionar para login
  if (error) {
    console.error("Erro na sessão:", error.message)

    // Criar uma nova resposta para redirecionar
    const redirectUrl = new URL("/", req.url)
    redirectUrl.searchParams.set("error_description", "Sua sessão expirou. Por favor, faça login novamente.")

    const redirectResponse = NextResponse.redirect(redirectUrl)

    // Limpar cookies (opcional)
    const cookieNames = ["sb-access-token", "sb-refresh-token"]
    cookieNames.forEach((name) => {
      redirectResponse.cookies.delete(name)
    })

    return redirectResponse
  }

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/", "/signup", "/forgot-password", "/reset-password", "/signup-success", "/auth/callback"]
  const isPublicRoute = publicRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith("/auth/"),
  )

  // Se o usuário estiver logado e acessar uma rota pública
  if (session && isPublicRoute && req.nextUrl.pathname !== "/auth/callback") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Se o usuário não estiver logado e acessar uma rota protegida
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
