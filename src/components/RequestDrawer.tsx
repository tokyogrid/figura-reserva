"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/Toaster"
import { Sparkles, Search, User, MessageSquare, Image as ImageIcon, Trash2, PlusCircle, Lock, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { useCSRF } from "@/hooks/useCSRF"

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

  // FIX 1: Inicializar imágenes con [""] para que el slot 1 esté disponible
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    figureName: "",
    series: "",
    manufacturer: "",
    scale: "",
    budgetMin: "",
    notes: "",
    images: JSON.stringify([""]),
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
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio"
    if (!formData.email.trim()) newErrors.email = "El correo es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Correo no válido"
    if (!formData.figureName.trim()) {
      newErrors.figureName = "El nombre de la figura es obligatorio"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

// FIX 2: Corrección del cierre de estado desactualizado al subir imágenes - usa Promises para procesar secuencialmente
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Procesar archivos secuencialmente para evitar race conditions
    for (const file of files) {
      // Validar formato - SOLO formatos soportados en Android/iOS web
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type.toLowerCase())) {
        toast({ type: "error", title: "Formato no válido", message: "Solo se permiten imágenes JPEG, PNG o WebP" })
        continue
      }
      
      // Límite de 10MB para máxima compatibilidad
      if (file.size > 10 * 1024 * 1024) {
        toast({ type: "error", title: "Archivo demasiado grande", message: "La imagen no debe superar los 10MB" })
        continue
      }

      try {
        const compressedDataUrl = await new Promise<string>((resolve, reject) => {
          const img = new Image()
          const objectUrl = URL.createObjectURL(file)
          
          // Timeout de seguridad para móviles (20s)
          const timeoutId = setTimeout(() => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error("Timeout al cargar la imagen (20s)"))
          }, 20000)
          
          img.onload = () => {
            clearTimeout(timeoutId)
            try {
              const MAX_WIDTH = 1024
              const MAX_HEIGHT = 1024
              let { width, height } = img
              
              // Reducir dimensiones para móviles
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height = Math.round((height * MAX_WIDTH) / width)
                  width = MAX_WIDTH
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width = Math.round((width * MAX_HEIGHT) / height)
                  height = MAX_HEIGHT
                }
              }
              
              const canvas = document.createElement("canvas")
              canvas.width = width
              canvas.height = height
              const ctx = canvas.getContext("2d")
              if (!ctx) {
                URL.revokeObjectURL(objectUrl)
                reject(new Error("No se pudo crear contexto del canvas"))
                return
              }
              ctx.drawImage(img, 0, 0, width, height)
              
              // Intentar JPEG primero, fallback a PNG para Android
              let compressedDataUrl: string
              try {
                compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75)
                // Verificar que sea JPEG válido (no fallback a PNG silencioso)
                if (!compressedDataUrl.startsWith("data:image/jpeg")) {
                  throw new Error("JPEG no soportado")
                }
              } catch (jpegError) {
                // Fallback a PNG para Android
                compressedDataUrl = canvas.toDataURL("image/png", 0.8)
              }
              
              URL.revokeObjectURL(objectUrl)
              resolve(compressedDataUrl)
            } catch (err) {
              URL.revokeObjectURL(objectUrl)
              reject(err)
            }
          }
          
          img.onerror = () => {
            clearTimeout(timeoutId)
            URL.revokeObjectURL(objectUrl)
            reject(new Error("Error al cargar la imagen - formato no soportado o archivo corrupto"))
          }
          
          // No usar crossOrigin para archivos locales (causa problemas en Android)
          img.src = objectUrl
        })
  
        // Actualizar estado usando functional update para evitar race conditions
        setFormData((prev) => {
          const currentImages = JSON.parse(prev.images || "[]").filter((url: string) => url.trim() !== "")
          const newImages = [...currentImages, compressedDataUrl]
          if (newImages.length > 10) newImages.length = 10
          console.log("[RequestDrawer] Imagen comprimida añadida, total:", newImages.length)
          return { ...prev, images: JSON.stringify(newImages) }
        })
  
      } catch (error) {
        console.error("[RequestDrawer] Error comprimiendo imagen:", error)
        const msg = error instanceof Error ? error.message : "No se pudo procesar la imagen"
        toast({ type: "error", title: "Error al procesar imagen", message: msg })
      }
    }
  }

  // FIX 3: Filtrar imágenes vacías antes de enviar el Payload al servidor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log("[RequestDrawer] formData.images at submit:", formData.images)
    console.log("[RequestDrawer] formData.images type:", typeof formData.images)
    
    setLoading(true)
    try {
      // Leer imágenes directamente del estado actual
      const currentImages = JSON.parse(formData.images || "[]").filter((url: string) => url.trim() !== "")
      console.log("[RequestDrawer] Submit - imágenes actuales:", currentImages.length, currentImages)

      const payload = {
        ...formData,
        images: JSON.stringify(currentImages),
        budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) * 100 : undefined,
      }

      console.log("[RequestDrawer] Payload enviado - images field:", payload.images)
      console.log("[RequestDrawer] Payload images length:", payload.images.length)

      const res = await fetchWithCSRF("/api/requests", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al enviar la solicitud")

      setSubmitted(true)
      toast({ type: "success", title: "¡Solicitud enviada!", message: "Te contactaremos cuando encontremos la figura" })
    } catch (error: any) {
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Imágenes para previsualización - retorna array vacío si no hay imágenes
  const parsedImagesList = (() => {
    try {
      const arr = JSON.parse(formData.images || "[]")
      return Array.isArray(arr) ? arr.filter((url: string) => url.trim() !== "") : []
    } catch {
      return []
    }
  })()

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 md:items-center bg-black/50 animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-2xl md:max-w-4xl bg-gray-950 border border-gray-800 rounded-t-2xl md:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{siteConfig.request.title}</h1>
              <p className="text-sm text-gray-400">{siteConfig.request.subtitle}</p>
            </div>
          </div>
          <button ref={focusRef} onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Datos del usuario */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Tus Datos</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nombre *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="Juan Pérez"
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                placeholder="juan@email.com"
                required
              />
            </div>
          </div>

          {/* Detalles de la Figura */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Detalles de la Figura</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Nombre de la Figura <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.figureName}
                  onChange={(e) => setFormData({ ...formData, figureName: e.target.value })}
                  className={cn(
                    "w-full px-3 py-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500",
                    errors.figureName && "border-red-500"
                  )}
                  placeholder="Ej. Anya Forger - Spy × Family"
                  required
                />
                {errors.figureName && <p className="mt-1.5 text-sm text-red-500">{errors.figureName}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Serie / Anime"
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  placeholder="Ej. One Piece, Evangelion..."
                />
                <Input
                  label="Fabricante"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Bandai, Good Smile..."
                />
              </div>
            </div>
          </div>

          {/* Imágenes de Referencia */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Imágenes de Referencia</h3>
            </div>

            <p className="text-sm text-gray-400 mb-4">Haz clic en "Añadir imagen" o arrastra archivos (JPEG/PNG/WebP, máx 10MB c/u, máx 10 imgs)</p>

            {/* Renderizado dinámico de previsualizaciones de imagen */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Renderizar imágenes existentes */}
              {parsedImagesList.map((img: string, idx: number) => (
                <div key={idx} className="relative group flex flex-col">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-700 overflow-hidden relative bg-gray-800">
                    {img ? (
                      <>
                        <img src={img} alt={`Referencia ${idx + 1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const newImages = parsedImagesList.filter((_: any, i: number) => i !== idx)
                            setFormData({ ...formData, images: JSON.stringify(newImages) })
                          }} 
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                        <PlusCircle className="h-8 w-8 mb-2" />
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <Input
                    label={`URL Imagen ${idx + 1}`}
                    value={img}
                    onChange={(e) => {
                      const newImages = [...parsedImagesList]
                      newImages[idx] = e.target.value
                      setFormData({ ...formData, images: JSON.stringify(newImages) })
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    type="url"
                    className="mt-2 text-sm"
                  />
                </div>
              ))}
              {/* Slot para añadir nueva imagen (siempre visible si hay menos de 10) */}
              {parsedImagesList.length < 10 && (
                <div key="add-new" className="relative group flex flex-col">
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-700 overflow-hidden relative bg-gray-800">
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4 cursor-pointer">
                      <PlusCircle className="h-8 w-8 mb-2" />
                      <span className="text-xs">Añadir imagen</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botón de envío */}
          <form onSubmit={handleSubmit} noValidate>
            <Button 
              type="submit" 
              disabled={loading} 
              loading={loading} 
              className="w-full h-12 text-lg" 
              variant="primary"
            >
              <span>Enviar Solicitud</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}