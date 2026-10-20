"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toaster"
import { Sparkles, Search, Banknote, User, Mail, MessageSquare, Image as ImageIcon, Plus, Trash2, PlusCircle, FileImage, Upload, Lock, X, ChevronDown } from "lucide-react"
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

interface RequestDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestDrawer({ isOpen, onClose }: RequestDrawerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { fetchWithCSRF } = useCSRF()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [mounted, setMounted] = useState(false)
  const focusRef = useRef<HTMLButtonElement>(null)

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
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      checkAuth()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && mounted) {
      focusRef.current?.focus()
    }
  }, [isOpen, mounted])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          setFormData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
          }))
        }
      }
    } catch (error) {
      // silent
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

    console.log("[RequestDrawer] Submitting formData:", { 
      ...formData, 
      imagesLen: formData.images?.length || 0,
      imagesPreview: formData.images?.substring(0, 100)
    })

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
      
      if (file.size > 10 * 1024 * 1024) {
        toast({ type: "error", title: "File too large", message: "Each image must be less than 10MB" })
        return
      }

      // Compress image client-side before base64 encoding
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
        // Max dimensions
        const MAX_WIDTH = 1920
        const MAX_HEIGHT = 1920
        let { width, height } = img
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * MAX_WIDTH / width)
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * MAX_HEIGHT / height)
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Compress to JPEG 0.8 quality (much smaller than PNG/base64)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        const currentImages = JSON.parse(formData.images || "[]")
        const newImages = [...currentImages, compressedDataUrl]
        if (newImages.length > 10) newImages.length = 10
        setFormData(prev => ({ ...prev, images: JSON.stringify(newImages) }))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const resetForm = () => {
    setFormData({
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
  }

  if (!isOpen) return null

  // Build all the conditional content using if statements
  let submittedContent = null
  if (submitted) {
    submittedContent = (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-md bg-gray-900 border-gray-800 animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
              <Sparkles className="h-8 w-8 text-green-500" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Request Sent!</h1>
            <p className="text-gray-400 mb-6">
              We received your request. We'll review it and email you at <strong className="text-white">{formData.email}</strong> if we can find the figure.
            </p>
            <div className="space-y-3">
              <Button onClick={() => { router.push("/catalog"); onClose(); }} variant="primary" className="w-full">
                Browse Catalog
              </Button>
              <Button onClick={() => { 
                setFormData({
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
                setSubmitted(false)
                onClose()
              }} variant="outline" className="w-full">
                Request Another Figure
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  let checkingAuthContent = null
  if (checkingAuth) {
    checkingAuthContent = (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-md bg-gray-900 border-gray-800 animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  let notAuthContent = null
  if (!user && !checkingAuth && !submitted) {
    notAuthContent = (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-md bg-gray-900 border-gray-800 animate-slide-up" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 w-fit">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-400 text-center mb-6">Please sign in to request a figure. You'll be redirected back here after signing in.</p>
            <div className="space-y-3">
              <Button onClick={() => { router.push("/login?callbackUrl=/request"); onClose(); }} variant="primary" className="w-full">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Sign In
              </Button>
              <Button onClick={() => { router.push("/register?callbackUrl=/request"); onClose(); }} variant="outline" className="w-full">
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  let drawerContent = null
  if (user && !checkingAuth && !submitted) {
    drawerContent = (
      <div 
        className="fixed inset-0 z-[9999] flex items-end justify-center p-4 md:items-center bg-black/50 animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-drawer-title"
      >
        <div 
          className="w-full max-w-2xl md:max-w-4xl bg-gray-950 border border-gray-800 rounded-t-2xl md:rounded-2xl animate-slide-up-modal max-h-[90vh] md:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
          style={{ transformOrigin: 'bottom' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 id="request-drawer-title" className="text-xl font-bold text-white">
                  {siteConfig.request.title}
                </h1>
                <p className="text-sm text-gray-400">{siteConfig.request.subtitle}</p>
              </div>
            </div>
            <button
              ref={focusRef}
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors md:hidden"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Your Information */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-400" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">Your Information</h3>
              </div>
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
            </div>

            {/* Figure Details */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-purple-400" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">Figure Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Figure Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="figureName"
                    value={formData.figureName}
                    onChange={(e) => setFormData({ ...formData, figureName: e.target.value })}
                    className={cn(
                      "w-full px-3 py-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
                      errors.figureName && "border-red-500"
                    )}
                    placeholder="e.g., Anya Forger - Figure - Spy × Family"
                    required
                    aria-invalid={errors.figureName ? "true" : "false"}
                  />
                {errors.figureName && (
                  <p className="mt-1.5 text-sm text-red-500" role="alert">
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
                <Input
                  label="Budget Min (€)"
                  id="budgetMin"
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                  placeholder="e.g., 150"
                />
              </div>
            </div>
          </div>

          {/* Reference Images */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-purple-400" aria-hidden="true" />
              <h3 className="text-lg font-bold text-white">Reference Images</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Upload reference images (JPEG/PNG, max 5MB each). Max 10 images.
            </p>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Reference Images (JPEG/PNG, max 5MB each)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Upload JPEG or PNG images (max 5MB each). Max 10 images. First image will be the main reference.</p>
            </div>

            {/* Image Previews & URL Inputs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {JSON.parse(formData.images || "[]").map((img: string, idx: number) => (
                <div key={idx} className="relative group flex flex-col">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-700 overflow-hidden relative bg-gray-800 group-hover:border-purple-500/50 transition-colors">
                    {img ? (
                      <>
                        <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const currentImages = JSON.parse(formData.images)
                            if (currentImages.length <= 1) return
                            const newImages = currentImages.filter((_: any, i: number) => i !== idx)
                            setFormData({ ...formData, images: JSON.stringify(newImages) })
                          }} 
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
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
                    className="mt-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-400" aria-hidden="true" />
              <h3 className="text-lg font-bold text-white">Additional Notes</h3>
            </div>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Specific version, exclusive, condition (new/used), reference links..."
              rows={4}
              className="w-full px-3 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
            />
          </div>

          {/* Submit Button */}
          <form onSubmit={handleSubmit} noValidate>
            <Button 
              type="submit" 
              disabled={loading} 
              loading={loading} 
              className="w-full h-12 text-lg group relative overflow-hidden" 
              variant="primary"
            >
              <Search className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              <span className="relative z-10">Submit Request</span>
            </Button>

            <p className="text-xs text-center text-gray-500">
              No purchase commitment. We'll contact you if we find the figure and you decide whether to reserve it.
            </p>
          </form>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] animate-fade-in">
      {submittedContent}
      {checkingAuthContent}
      {notAuthContent}
      {drawerContent}
    </div>
  )
}