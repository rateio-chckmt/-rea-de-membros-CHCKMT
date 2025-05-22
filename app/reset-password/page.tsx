"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { createClient_Client } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState<boolean | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string
  }>({ score: 0, feedback: "" })
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient_Client()

  // Verificar se existe um token válido
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        // Se não houver sessão ou token de recuperação
        if (!data?.session) {
          setValidToken(false)
          setError("Link de redefinição de senha inválido ou expirado. Por favor, solicite um novo link.")
          return
        }

        // Verificar se este é um fluxo de recuperação de senha
        const type = searchParams?.get("type")
        if (type === "recovery") {
          setValidToken(true)
        } else {
          // Se não for um fluxo de recuperação, redirecionar para o dashboard
          router.push("/dashboard")
        }
      } catch (error: any) {
        console.error("Erro ao verificar sessão:", error.message)
        setValidToken(false)
        setError("Ocorreu um erro ao verificar sua sessão. Por favor, tente novamente.")
      }
    }

    checkSession()
  }, [router, searchParams, supabase.auth])

  // Validar força da senha
  useEffect(() => {
    const validatePasswordStrength = (pass: string) => {
      if (!pass) {
        setPasswordStrength({ score: 0, feedback: "" })
        return
      }

      let score = 0
      let feedback = ""

      // Comprimento mínimo
      if (pass.length >= 8) score += 1

      // Contém letra maiúscula
      if (/[A-Z]/.test(pass)) score += 1

      // Contém letra minúscula
      if (/[a-z]/.test(pass)) score += 1

      // Contém número
      if (/[0-9]/.test(pass)) score += 1

      // Contém caractere especial
      if (/[^A-Za-z0-9]/.test(pass)) score += 1

      // Feedback baseado na pontuação
      if (score < 3) {
        feedback = "Senha fraca. Adicione letras maiúsculas, números e caracteres especiais."
      } else if (score < 5) {
        feedback = "Senha média. Adicione mais variação para maior segurança."
      } else {
        feedback = "Senha forte!"
      }

      setPasswordStrength({ score, feedback })
    }

    validatePasswordStrength(password)
  }, [password])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres")
      return
    }

    if (passwordStrength.score < 3) {
      setError("Por favor, escolha uma senha mais forte")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Falha ao redefinir a senha")
    } finally {
      setLoading(false)
    }
  }

  // Renderizar mensagem de erro se o token for inválido
  if (validToken === false) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4">
        <div className="w-full max-w-md bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
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

            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error || "Link de redefinição de senha inválido ou expirado"}</AlertDescription>
            </Alert>

            <div className="text-center">
              <Button asChild className="bg-[#0070f3] hover:bg-[#0060df] text-white mt-4">
                <Link href="/forgot-password">Solicitar novo link</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar carregando enquanto verifica o token
  if (validToken === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4">
        <div className="flex flex-col items-center justify-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Verificando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4">
      <div className="w-full max-w-md bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
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

          <h1 className="text-2xl font-bold text-white mb-2 text-center">Redefina sua senha</h1>
          <p className="text-gray-400 text-center mb-6">Digite sua nova senha abaixo</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-md text-green-500 text-sm">
              Senha atualizada com sucesso! Redirecionando para o login...
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-300">
                Nova senha
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
                  className="pl-10 pr-10 bg-[#252525] border-[#333]"
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
              {password && (
                <div className="mt-1">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= passwordStrength.score
                            ? i <= 2
                              ? "bg-red-500"
                              : i <= 4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      passwordStrength.score <= 2
                        ? "text-red-500"
                        : passwordStrength.score <= 4
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm text-gray-300">
                Confirme a nova senha
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-[#252525] border-[#333]"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">As senhas não coincidem</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white transition-all duration-200 h-11"
              disabled={loading || success || password !== confirmPassword || passwordStrength.score < 3}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Redefinir senha"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Lembrou sua senha?{" "}
            <Link href="/" className="text-[#0070f3] hover:text-[#3291ff] transition-colors">
              Voltar ao login
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
