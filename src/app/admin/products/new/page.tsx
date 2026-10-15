"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: "",
    category: "Figure",
    series: "",
    character: "",
    manufacturer: "",
    scale: "",
    releaseDate: "",
    stock: "0",
    status: "AVAILABLE",
    isFeatured: false,
    sortOrder: "0",
    isHidden: false,
    isUnpurchasable: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          stock: parseInt(formData.stock) || 0,
          sortOrder: parseInt(formData.sortOrder) || 0,
          isFeatured: formData.isFeatured,
          isHidden: formData.isHidden,
          isUnpurchasable: formData.isUnpurchasable,
          releaseDate: formData.releaseDate || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error creating product")
      toast({ type: "success", title: "Product created" })
      router.push(`/admin/products/${data.product.id}/edit`)
      router.refresh()
    } catch (error: any) {
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Product</h1>
          <p className="text-gray-600 dark:text-gray-400">Add a new figure to the catalog</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="Name *"
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Figure name"
                required
              />
              <Input
                label="Series"
                id="series"
                value={formData.series}
                onChange={e => setFormData({ ...formData, series: e.target.value })}
                placeholder="One Piece, Naruto, etc."
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <Input
                label="Character"
                id="character"
                value={formData.character}
                onChange={e => setFormData({ ...formData, character: e.target.value })}
                placeholder="Character name"
              />
              <Input
                label="Manufacturer"
                id="manufacturer"
                value={formData.manufacturer}
                onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Bandai, Good Smile, etc."
              />
              <Input
                label="Scale"
                id="scale"
                value={formData.scale}
                onChange={e => setFormData({ ...formData, scale: e.target.value })}
                placeholder="1/7, 1/8, etc."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="Category"
                id="category"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="Figure"
              />
              <select
                id="status"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AVAILABLE">Available</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="PRE_ORDER">Pre-order</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="Price (€) *"
                type="number"
                step="0.01"
                id="price"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="99.99"
                required
              />
              <Input
                label="Original Price (€)"
                type="number"
                step="0.01"
                id="originalPrice"
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="129.99"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <Input
                label="Stock *"
                type="number"
                id="stock"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="10"
                required
              />
              <Input
                label="Sort Order"
                type="number"
                id="sortOrder"
                value={formData.sortOrder}
                onChange={e => setFormData({ ...formData, sortOrder: e.target.value })}
                placeholder="0"
              />
              <Input
                label="Release Date"
                type="date"
                id="releaseDate"
                value={formData.releaseDate}
                onChange={e => setFormData({ ...formData, releaseDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Image URLs (one per line)
              </label>
              <textarea
                id="images"
                value={formData.images}
                onChange={e => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHidden}
                  onChange={e => setFormData({ ...formData, isHidden: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Hidden from catalog</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isUnpurchasable}
                  onChange={e => setFormData({ ...formData, isUnpurchasable: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Not purchasable</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/admin/products">
                <Button variant="outline" disabled={loading}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} loading={loading} variant="primary">
                <Loader2 className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}