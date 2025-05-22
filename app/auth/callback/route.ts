import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // Se houver um erro no processo de autenticação
  if (error) {
    const encodedError = encodeURIComponent(errorDescription || error)
    return NextResponse.redirect(new URL(`/?error_description=${encodedError}`, request.url))
  }

  // Se não houver código, redirecionar para a página inicial
  if (!code) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Trocar o código pelo token de sessão
    await supabase.auth.exchangeCodeForSession(code)

    // Redirecionar para o dashboard após login bem-sucedido
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Erro ao processar callback de autenticação:", error)

    // Redirecionar para a página inicial com mensagem de erro
    const encodedError = encodeURIComponent(
      "Ocorreu um erro durante o processo de autenticação. Por favor, tente novamente.",
    )
    return NextResponse.redirect(new URL(`/?error_description=${encodedError}`, request.url))
  }
}
