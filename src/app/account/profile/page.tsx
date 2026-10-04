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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                <p className="text-gray-600 dark:text-gray-400">Your details are used for order processing and shipping</p>
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
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Address"
                    id="address"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, Apt 4B"
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      id="city"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Madrid"
                    />
                    <Input
                      label="Postal Code"
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="28001"
                      maxLength={5}
                    />
                    <select
                      id="country"
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value as CountryCode })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={() => router.back()}>
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