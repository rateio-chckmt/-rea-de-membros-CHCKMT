"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SignupSuccess() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0f0f] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4">
      <div className="w-full max-w-md bg-[#1a1a1a]/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 flex flex-col items-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-12">
              <Image src="/digital-tools-platform-logo.png" alt="Digital Tools Platform" fill className="object-contain" />
            </div>
          </div>

          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />

          <h1 className="text-2xl font-bold text-white mb-2 text-center">Check your email</h1>
          <p className="text-gray-400 text-center mb-6">
            We've sent you a confirmation email. Please check your inbox and click the link to verify your account.
          </p>

          <Button
            asChild
            className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white transition-all duration-200 h-11 mb-4"
          >
            <Link href="/">Return to login</Link>
          </Button>

          <p className="text-sm text-gray-400 text-center">
            Didn't receive an email? Check your spam folder or{" "}
            <Link href="/signup" className="text-[#0070f3] hover:text-[#3291ff] transition-colors">
              try again
            </Link>
          </p>
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
