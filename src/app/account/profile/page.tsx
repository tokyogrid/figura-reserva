"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { useAuth } from "@/lib/AuthContext"
import { siteConfig } from "@/lib/site-config"
import { ArrowLeft, Save, MapPin, Shield, User } from "lucide-react"
import { countries, CountryCode } from "@/lib/countries"
import { useCSRF } from "@/hooks/useCSRF"

interface UserProfile {
  name: string
  email: string
  address: string
  city: string
  postalCode: string
  country: CountryCode
}

export default function AccountProfilePage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const { fetchWithCSRF } = useCSRF()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "ES" as CountryCode,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        country: (user.country as CountryCode) || "ES",
      })
    }
    setLoading(false)
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetchWithCSRF("/api/account/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update profile")
      }

      toast({ type: "success", title: "Profile updated!" })
      await refreshUser()
    } catch (error: any) {
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/10">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-400">Manage your account information</p>
            </div>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                <p className="text-gray-400">Your details are used for order processing and shipping</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  required
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@email.com"
                  required
                  disabled
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
                />
              </div>

              <div className="border-t border-gray-800/50 pt-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Address"
                    id="address"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, Apt 4B"
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      id="city"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Madrid"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <Input
                      label="Postal Code"
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="28001"
                      maxLength={5}
                      className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <select
                      id="country"
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value as CountryCode })}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-800/50">
                <Button variant="outline" onClick={() => router.back()} className="border-white/10 text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} loading={saving} className="gap-2" variant="primary">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}