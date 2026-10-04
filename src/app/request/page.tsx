"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { Sparkles, Search, Banknote, User, Mail, MessageSquare, Image as ImageIcon, Plus, Trash2, PlusCircle, Trash2 as TrashIcon, FileImage, Upload, Lock } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { useCSRF } from "@/hooks/useCSRF"

interface FormData {
  name: string
  email: string
  figureName: string
  series: string
  manufacturer: string
  scale: string
  budgetMin: string
  notes: string
  images: string
  bulkImages: string
}

interface User {
  id: string
  email: string
  name: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  phone?: string
}

export default function RequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { fetchWithCSRF } = useCSRF()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    figureName: "",
    series: "",
    manufacturer: "",
    scale: "",
    budgetMin: "",
    notes: "",
    images: "[]",
    bulkImages: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
          }))
        } else {
          router.push("/login?callbackUrl=/request")
        }
      }
    } catch (error) {
      router.push("/login?callbackUrl=/request")
    } finally {
      setCheckingAuth(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.figureName.trim()) {
      newErrors.figureName = "Figure name is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await fetchWithCSRF("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) * 100 : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error submitting request")

      setSubmitted(true)
      toast({ type: "success", title: "Request Sent!", message: "We'll contact you if we find the figure" })
    } catch (error: any) {
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        toast({ type: "error", title: "Invalid file type", message: "Only JPEG and PNG files are allowed" })
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({ type: "error", title: "File too large", message: "Each image must be less than 5MB" })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const currentImages = JSON.parse(formData.images || "[]")
        const newImages = [...currentImages, e?.target?.result]
        if (newImages.length > 10) newImages.length = 10
        setFormData(prev => ({ ...prev, images: JSON.stringify(newImages) }))
      }
      reader.readAsDataURL(file)
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <Sparkles className="h-8 w-8 text-green-500" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We received your request. We'll review it and email you at <strong>{formData.email}</strong> if we can find the figure.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/catalog")} variant="primary" className="w-full">
                Browse Catalog
              </Button>
              <Button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", figureName: "", series: "", manufacturer: "", scale: "", budgetMin: "", notes: "", images: "[]", bulkImages: "" }) }} variant="outline" className="w-full">
                Request Another Figure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full mb-4">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">Custom Figure Search</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {siteConfig.request.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {siteConfig.request.subtitle}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" aria-hidden="true" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  placeholder="John Smith"
                  required
                />
                <Input
                  label="Email *"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  placeholder="john@email.com"
                  required
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Figure Details</h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Figure Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="figureName"
                    value={formData.figureName}
                    onChange={(e) => setFormData({ ...formData, figureName: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-lg font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Anya Forger - Figure - Spy × Family"
                    required
                    aria-invalid={errors.figureName ? "true" : "false"}
                  />
                  {errors.figureName && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.figureName}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Series / Anime"
                    id="series"
                    value={formData.series}
                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                    placeholder="e.g., Spy × Family, One Piece, Evangelion..."
                  />
                  <Input
                    label="Manufacturer"
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Bandai, Good Smile, Kotobukiya..."
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    label="Scale"
                    id="scale"
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                    placeholder="1/7, 1/8, Nendoroid..."
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reference Images</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Reference Images (JPEG/PNG, max 5MB each)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload JPEG or PNG images (max 5MB each). Max 10 images. First image will be the main reference.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
                    {JSON.parse(formData.images || "[]").map((img: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden relative bg-gray-50 dark:bg-gray-800">
                          {img ? (
                            <>
                              <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                const currentImages = JSON.parse(formData.images)
                                if (currentImages.length <= 1) return
                                const newImages = currentImages.filter((_: any, i: number) => i !== idx)
                                setFormData({ ...formData, images: JSON.stringify(newImages) })
                              }} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                              <PlusCircle className="h-8 w-8 mb-2" />
                              <span className="text-xs">Add image</span>
                            </div>
                          )}
                        </div>
                        <Input
                          label={`Image ${idx + 1}`}
                          id={`img-${idx}`}
                          value={img}
                          onChange={(e) => {
                            const currentImages = JSON.parse(formData.images)
                            const newImages = [...currentImages]
                            newImages[idx] = e.target.value
                            if (idx === newImages.length - 1 && e.target.value.trim()) newImages.push("")
                            while (newImages.length > 1 && !newImages[newImages.length - 1].trim()) newImages.pop()
                            setFormData({ ...formData, images: JSON.stringify(newImages) })
                          }}
                          placeholder="https://example.com/image.jpg"
                          type="url"
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Specific version, exclusive, condition (new/used), reference links..."
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} loading={loading} className="w-full h-12 text-lg" variant="primary">
                <Search className="h-4 w-4" aria-hidden="true" />
                Submit Request
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                No purchase commitment. We'll contact you if we find the figure and you decide whether to reserve it.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Banknote className="h-8 w-8 text-blue-500 mx-auto mb-2" aria-hidden="true" />
            <p className="font-medium text-gray-900 dark:text-white">Japan Prices</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">We search at best price from Japanese suppliers</p>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" aria-hidden="true" />
            <p className="font-medium text-gray-900 dark:text-white">Priority Access</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">If we find it, you get first dibs to reserve</p>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" aria-hidden="true" />
            <p className="font-medium text-gray-900 dark:text-white">No Commitment</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Only reserve if you like the final price</p>
          </div>
        </div>
      </div>
    </div>
  )
}