"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { createClient_Client } from "@/lib/supabase"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient_Client()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      // Show success message or redirect
      router.push("/signup-success")
    } catch (error: any) {
      setError(error.message || "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const isEmailValid = !email || validateEmail(email)
  const isPasswordValid = !password || password.length >= 6

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

          <h1 className="text-2xl font-bold text-white mb-6 text-center">Create an account</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-300">
                Full name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 bg-[#252525] border-[#333]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-300">
                Email address
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
                  placeholder="name@example.com"
                  className={`pl-10 bg-[#252525] border-[#333] ${!isEmailValid ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {!isEmailValid && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-300">
                Password
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
                  className={`pl-10 pr-10 bg-[#252525] border-[#333] ${!isPasswordValid ? "border-red-500" : ""}`}
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
              {!isPasswordValid && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white transition-all duration-200 h-11"
              disabled={loading || !isEmailValid || !isPasswordValid}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/" className="text-[#0070f3] hover:text-[#3291ff] transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <div className="px-8 py-4 bg-[#151515] border-t border-[#252525] text-xs text-gray-500 flex justify-between">
          <Link href="/terms" className="hover:text-gray-300 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy
          </Link>
          <Link href="/help" className="hover:text-gray-300 transition-colors">
            Help
          </Link>
          <span>© 2024 Digital Tools</span>
        </div>
      </div>
    </div>
  )
}
