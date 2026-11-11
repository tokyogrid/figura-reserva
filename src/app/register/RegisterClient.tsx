"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { Sparkles, Lock, Loader2, Mail, User as UserIcon, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { countries, CountryCode } from "@/lib/countries"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("ES")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || "Usuario", address, city, postalCode, country }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Credenciales inválidas")

      toast({ type: "success", title: "¡Cuenta creada! Revisa tu email para el código de verificación." })
      router.push(`/verify?email=${encodeURIComponent(email)}`)
      router.refresh()
    } catch (error: any) {
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
          <CardTitle className="text-white">Crear Cuenta</CardTitle>
          <p className="text-gray-400">
            Crea tu cuenta para empezar a solicitar figuras
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
              label="Nombre"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              required
              autoComplete="name"
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <Input
              label="Dirección"
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle Principal 123, 4ºB"
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
            />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Ciudad"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Madrid"
                required
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
              <Input
                label="Código Postal"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="28001"
                required
                maxLength={5}
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
              <select
                id="country"
                value={country}
                onChange={e => setCountry(e.target.value as CountryCode)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} loading={loading} className="w-full h-12" variant="primary">
              <Loader2 className="h-4 w-4" aria-hidden="true" />
              Crear Cuenta
            </Button>
            <p className="text-center text-sm text-gray-500 mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link
                href={`/login?callbackUrl=${callbackUrl}`}
                className="text-purple-400 cursor-pointer underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}