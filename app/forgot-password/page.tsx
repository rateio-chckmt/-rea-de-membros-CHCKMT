"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Loader2, ArrowLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { createClient_Client } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)
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

  // Gerenciar cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown(cooldown - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [cooldown])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    if (!email) {
      setMessage({
        type: "error",
        text: "Por favor, informe seu email.",
      })
      return
    }

    if (!isValidEmail) {
      setMessage({
        type: "error",
        text: "Por favor, informe um email válido.",
      })
      return
    }

    // Verificar cooldown
    if (cooldown > 0) {
      setMessage({
        type: "info",
        text: `Por favor, aguarde ${cooldown} segundos antes de tentar novamente.`,
      })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?type=recovery`,
      })

      if (error) {
        throw error
      }

      // Aumentar contagem de tentativas e definir cooldown se necessário
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        setCooldown(60) // 60 segundos de cooldown após 3 tentativas
      }

      setMessage({
        type: "success",
        text: "Verifique seu email para obter o link de redefinição de senha. Se você não receber o email em alguns minutos, verifique sua pasta de spam.",
      })
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      setMessage({
        type: "error",
        text: "Ocorreu um erro ao enviar o email de redefinição. Por favor, tente novamente mais tarde.",
      })
    } finally {
      setLoading(false)
    }
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
          <p className="text-gray-400 text-center mb-6">Enviaremos um email com um link para redefinir sua senha</p>

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : message.type === "info" ? "default" : "success"}
              className="mb-4"
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {cooldown > 0 && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/50 rounded-md text-blue-500 text-sm flex items-center">
              <Info size={16} className="mr-2" />
              <span>Você poderá tentar novamente em {cooldown} segundos</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
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

            <Button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white transition-all duration-200 h-11"
              disabled={loading || cooldown > 0 || !isValidEmail}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar link de redefinição"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-[#0070f3] hover:text-[#3291ff] transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
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
