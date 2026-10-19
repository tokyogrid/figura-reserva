"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { useAuth } from "@/lib/AuthContext"
import { Sparkles, Lock, Loader2, Eye, EyeOff, HelpCircle, Mail } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login: authLogin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await authLogin(email, password)

      toast({ type: "success", title: "Welcome back!" })
      router.push("/")
      router.refresh()
    } catch (error: any) {
      if (error.message.startsWith("VERIFICATION_REQUIRED:")) {
        const verifyEmail = error.message.split(":")[1]
        router.push(`/verify?email=${encodeURIComponent(verifyEmail)}`)
        return
      }
      setError(error.message)
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-white">Sign in to Tokyo Grid</CardTitle>
          <p className="text-gray-400">
            Sign in to request figures or check orders
          </p>
        </CardHeader>
        <CardContent className="bg-gray-900/30">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Link
                href="/contact"
                className="text-sm text-purple-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                Forgot password?
              </Link>
              <Link
                href="/contact"
                className="text-sm text-purple-400 hover:underline flex items-center gap-1"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact Support
              </Link>
            </div>
            <Button type="submit" disabled={loading} loading={loading} className="w-full h-12" variant="primary">
              <Loader2 className="h-4 w-4" aria-hidden="true" />
              Sign in
            </Button>
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-purple-400 cursor-pointer underline"
              >
                Create account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>}>
      <LoginForm />
    </Suspense>
  )
}