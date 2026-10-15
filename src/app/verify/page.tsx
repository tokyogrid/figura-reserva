"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { Sparkles, Loader2 } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

function VerifyForm({ email }: { email: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    if (newCode.every(c => c !== "")) {
      handleSubmit()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
const digits = pasted.split("")
      setCode(digits)
      digits.forEach((_, i) => {
        const input = document.getElementById(`code-${i}`) as HTMLInputElement | null
        if (input) input.value = digits[i] || ""
      })
    if (pasted.length === 6) handleSubmit()
  }

  const handleSubmit = async () => {
    const fullCode = code.join("")
    if (fullCode.length !== 6) return

    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: new URLSearchParams(window.location.search).get("email"), code: code.join("") }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid code")

      toast({ type: "success", title: "Email verified!" })
      router.push("/login")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
      setCode(["", "", "", "", "", ""])
      document.getElementById("code-0")?.focus()
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    const searchParams = new URLSearchParams(window.location.search)
    const email = searchParams.get("email") || ""
    setLoading(true)
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to resend")

      toast({ type: "success", title: "Code resent!" })
    } catch (error: any) {
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2-2v6a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2-2v6a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2-2v6a2 2 0 002-2h10z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17h4v-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-center" role="group" aria-label="Verification code">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={code[index]}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  className="w-10 h-12 text-center text-2xl font-medium border-2 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-colors"
                  placeholder=""
                />
              ))}
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={loading || code.some(c => !c)}
                loading={loading}
                className="w-full h-12"
                variant="primary"
              >
                Verify Email
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={loading}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Didn't receive the code? Resend
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Code expires in 15 minutes. Didn't receive it? Check spam folder.
              </p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Already verified? Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")

  const email = searchParams.get("email") || ""

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Missing Email</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please provide an email to verify.</p>
          <a href="/login" className="text-blue-600 hover:underline">Back to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <VerifyForm email={email} />
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><div className="animate-pulse text-gray-500">Loading...</div></div>}>
      <VerifyContent />
    </Suspense>
  )
}