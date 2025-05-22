"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { createClient_Client } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const router = useRouter()
  const supabase = createClient_Client()

  // Validar email em tempo real
  useEffect(() => {
    if (!email) {
      setIsValidEmail(true)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(email))
  }, [email])

  // Validar senha em tempo real
  useEffect(() => {
    if (!password) {
      setIsValidPassword(true)
      return
    }

    setIsValidPassword(password.length >= 6)
  }, [password])

  // Verificar se há um erro de autenticação no URL
  useEffect(() => {
    const checkForErrors = () => {
      const url = new URL(window.location.href)
      const errorDescription = url.searchParams.get("error_description")

      if (errorDescription) {
        setError(decodeURIComponent(errorDescription))

        // Remover os parâmetros de erro da URL
        url.searchParams.delete("error_description")
        url.searchParams.delete("error")
        window.history.replaceState({}, document.title, url.toString())
      }
    }

    checkForErrors()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validar formulário
    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (!isValidEmail) {
      setError("Por favor, informe um email válido")
      return
    }

    if (!isValidPassword) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Implementar "Lembrar-me"
          // Por padrão, o Supabase usa expiryInSeconds: 3600 (1 hora)
          // Se "Lembrar-me" estiver marcado, definimos para 30 dias
          expiryInSeconds: rememberMe ? 60 * 60 * 24 * 30 : undefined,
        },
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Erro de login:", error)

      // Mensagens de erro mais amigáveis
      if (error.message.includes("Invalid login")) {
        setError("Email ou senha incorretos. Por favor, tente novamente.")
      } else if (error.message.includes("Email not confirmed")) {
        setError("Sua conta não foi confirmada. Por favor, verifique seu email para confirmar sua conta.")
      } else {
        setError(error.message || "Falha ao fazer login")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4">
      <div className="w-full max-w-md bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-12">
              <Image
                src="/digital-tools-platform-logo.png"
                alt="Digital Tools Platform"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-6 text-center">Bem-vindo de volta</h1>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-300">
                Endereço de email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className={`pl-10 bg-[#252525] border-[#333] ${!isValidEmail && email ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {!isValidEmail && email && (
                <p className="text-red-500 text-xs mt-1">Por favor, informe um email válido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 bg-[#252525] border-[#333] ${!isValidPassword && password ? "border-red-500" : ""}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isValidPassword && password && (
                <p className="text-red-500 text-xs mt-1">A senha deve ter pelo menos 6 caracteres</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#0070f3] hover:text-[#3291ff] transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white transition-all duration-200 h-11"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Não tem uma conta?{" "}
            <Link href="/signup" className="text-[#0070f3] hover:text-[#3291ff] transition-colors">
              Cadastre-se
            </Link>
          </div>
        </div>

        <div className="px-8 py-4 bg-[#151515] border-t border-[#252525] text-xs text-gray-500 flex justify-between">
          <Link href="/terms" className="hover:text-gray-300 transition-colors">
            Termos
          </Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacidade
          </Link>
          <Link href="/help" className="hover:text-gray-300 transition-colors">
            Ajuda
          </Link>
          <span>© 2024 Digital Tools</span>
        </div>
      </div>
    </div>
  )
}
