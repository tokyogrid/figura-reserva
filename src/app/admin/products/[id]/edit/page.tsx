"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input, Textarea } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { Loader2, ArrowLeft, Image as ImageIcon, Plus, Trash2, Save } from "lucide-react"
import { formatPrice, parseImages, stringifyImages } from "@/lib/utils"

interface FormData {
  name: string; description: string; price: string; originalPrice: string; images: string; bulkImages: string
  category: string; series: string; character: string; manufacturer: string; scale: string
  releaseDate: string; stock: string; status: string; isFeatured: boolean; sortOrder: string
}

const initialForm: FormData = { name: "", description: "", price: "", originalPrice: "", images: "[]", bulkImages: "", category: "", series: "", character: "", manufacturer: "", scale: "", releaseDate: "", stock: "0", status: "AVAILABLE", isFeatured: false, sortOrder: "0" }
const statusOptions = [{ value: "AVAILABLE", label: "Available" }, { value: "LOW_STOCK", label: "Low Stock" }, { value: "OUT_OF_STOCK", label: "Out of Stock" }, { value: "PRE_ORDER", label: "Pre-order" }, { value: "DISCONTINUED", label: "Discontinued" }]

export default function AdminProductFormPage() {
  const router = useRouter(); const params = useParams(); const { toast } = useToast()
  const isEdit = Boolean(params.id)
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>(initialForm); const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { if (isEdit) fetchProduct() }, [params.id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, { credentials: "include" })
      const data = await res.json()
      if (data.product) {
        const p = data.product
        setForm({
          name: p.name ?? "",
          description: p.description ?? "",
          price: p.price ? (p.price / 100).toFixed(2) : "",
          originalPrice: p.originalPrice ? (p.originalPrice / 100).toFixed(2) : "",
          images: stringifyImages(JSON.parse(p.images || "[]")),
          bulkImages: "",
          category: p.category ?? "",
          series: p.series ?? "",
          character: p.character ?? "",
          manufacturer: p.manufacturer ?? "",
          scale: p.scale ?? "",
          releaseDate: p.releaseDate ? p.releaseDate.split("T")[0] : "",
          stock: String(p.stock ?? 0),
          status: p.status ?? "AVAILABLE",
          isFeatured: p.isFeatured ?? false,
          sortOrder: String(p.sortOrder ?? 0)
        })
      }
    } catch { toast({ type: "error", title: "Error", message: "Failed to load" }) }
    finally { setLoading(false) }
  }

  const validateForm = () => { const e: Record<string, string> = {}; if (!form.name.trim()) e.name = "Required"; if (!form.price || parseFloat(form.price) <= 0) e.price = "Valid price"; if (!parseImages(form.images)[0]?.trim()) e.images = "At least one image"; if (parseInt(form.stock) < 0) e.stock = "Invalid stock"; setErrors(e); return Object.keys(e).length === 0 }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!validateForm()) return
    setSaving(true)
    try {
      const res = await fetch(isEdit ? `/api/admin/products/${params.id}` : "/api/admin/products", { 
        method: isEdit ? "PUT" : "POST", 
        headers: { "Content-Type": "application/json" }, 
        credentials: "include",
        body: JSON.stringify({ ...form, price: form.price, originalPrice: form.originalPrice || null, stock: parseInt(form.stock), sortOrder: parseInt(form.sortOrder), releaseDate: form.releaseDate || null, isFeatured: form.isFeatured, images: form.images }) 
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Error") }
      toast({ type: "success", title: isEdit ? "Updated" : "Created" }); router.push("/admin/products"); router.refresh()
    } catch (err: any) { toast({ type: "error", title: "Error", message: err.message }) }
    finally { setSaving(false) }
  }

  const handleImageChange = (i: number, url: string) => { const imgs = parseImages(form.images); imgs[i] = url; if (i === imgs.length - 1 && url.trim()) imgs.push(""); while (imgs.length > 1 && !imgs[imgs.length - 1].trim()) imgs.pop(); setForm({ ...form, images: stringifyImages(imgs) }) }
  const removeImage = (i: number) => { const imgs = parseImages(form.images); if (imgs.length <= 1) return; setForm({ ...form, images: stringifyImages(imgs.filter((_, idx) => idx !== i)) }) }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4"><Button variant="ghost" onClick={() => router.back()} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button><div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Product" : "New Product"}</h1><p className="text-gray-600 dark:text-gray-400">{isEdit ? "Modify figure" : "Add new figure"}</p></div></div>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Basic Info</CardTitle></CardHeader><CardContent className="space-y-4">
          <Input label="Name *" id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Anya Forger - Figure - Spy × Family" required />
          <Textarea label="Description" id="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Details: materials, accessories, version..." rows={4} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Price (€) *" id="price" type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} error={errors.price} placeholder="129.99" required />
            <Input label="Original Price (€)" id="originalPrice" type="text" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="159.99" />
            <Input label="Stock *" id="stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} error={errors.stock} placeholder="5" required />
          </div>
        </CardContent></Card>

        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Images (max 10)</CardTitle></CardHeader><CardContent className="space-y-4">
          {/* Bulk URL input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste multiple URLs (one per line)</label>
            <textarea
              value={form.bulkImages || ""}
              onChange={e => {
                const urls = e.target.value.split("\n").filter(u => u.trim())
                const currentImages = parseImages(form.images)
                const newImages = [...currentImages]
                urls.forEach(u => { if (!newImages.includes(u.trim())) newImages.push(u.trim()) })
                if (newImages.length > 10) newImages.length = 10
                setForm({ ...form, images: stringifyImages(newImages), bulkImages: e.target.value })
              }}
              placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Paste one URL per line. Max 10 images. First image is the cover.</p>
          </div>

          {/* Image previews with individual URL inputs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {parseImages(form.images).map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden relative bg-gray-50 dark:bg-gray-800">
                  {img ? (
                    <>
                      <img src={img} alt={`Img ${idx+1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-xs">Add image</span>
                    </div>
                  )}
                </div>
                <Input
                  label={`Image ${idx+1}`}
                  id={`img-${idx}`}
                  value={img}
                  onChange={e => handleImageChange(idx, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                  className="mt-2"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Use direct image URLs (Subuya, Suruga-ya, your hosting). First is cover.</p></CardContent></Card>

        <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Series/Anime" id="series" value={form.series} onChange={e => setForm({ ...form, series: e.target.value })} placeholder="Spy × Family" />
            <Input label="Character" id="character" value={form.character} onChange={e => setForm({ ...form, character: e.target.value })} placeholder="Anya Forger" />
          </div><div className="grid sm:grid-cols-3 gap-4">
            <Input label="Manufacturer" id="manufacturer" value={form.manufacturer} onChange={e => setForm({ ...form, manufacturer: e.target.value })} placeholder="Bandai, Good Smile..." />
            <Input label="Scale" id="scale" value={form.scale} onChange={e => setForm({ ...form, scale: e.target.value })} placeholder="1/7, 1/8, Nendoroid..." />
            <Input label="Category" id="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Figure, Nendoroid..." />
          </div><Input label="Release Date" id="releaseDate" type="date" value={form.releaseDate} onChange={e => setForm({ ...form, releaseDate: e.target.value })} />
        </CardContent></Card>

        <Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">{statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
            <Input label="Sort Order" id="sortOrder" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} placeholder="0" />
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Featured on home</span></label>
          </div></CardContent></Card>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={() => router.back()}><ArrowLeft className="h-4 w-4" /> Cancel</Button>
          <Button type="submit" disabled={saving} loading={saving} className="gap-2" variant="primary"><Save className="h-4 w-4" />{isEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </div>
  )
}