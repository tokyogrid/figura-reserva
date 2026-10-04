"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, ChevronDown } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number | null
  images: string
  category: string | null
  series: string | null
  stock: number
  reserved: number
  status: string
  isFeatured: boolean
  createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchProducts() }, [search, statusFilter])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      params.set("admin", "true")
      const res = await fetch(`/api/admin/products?${params}`, { credentials: "include" })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE", credentials: "include" })
      if (!res.ok) throw new Error("Failed")
      fetchProducts()
    } catch { alert("Error deleting") }
  }

  const available = (p: Product) => p.stock - p.reserved

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your figure catalog</p>
        </div>
        <Link href="/admin/products/new"><Button className="gap-2"><Plus className="h-4 w-4" /> New Product</Button></Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 pt-0">
        <div className={cn("space-y-4", showFilters ? "" : "hidden md:block")}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search name, series, character..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="PRE_ORDER">Pre-order</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
        </div>
        <div className="md:hidden">
          <Button variant="outline" className="w-full gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" /> Filters <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" /><p className="mt-4 text-gray-500">Loading...</p></div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first figure</p>
            <Link href="/admin/products/new"><Button variant="primary" className="gap-2"><Plus className="h-4 w-4" /> Create Product</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <th className="p-4">Image</th><th className="p-4">Product</th><th className="p-4 hidden md:table-cell">Series</th>
                  <th className="p-4 text-right">Price</th><th className="p-4 text-center hidden lg:table-cell">Stock</th>
                  <th className="p-4 text-center">Status</th><th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map(product => {
                  const images = product.images ? JSON.parse(product.images) : []
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {images[0] ? <img src={images[0]} alt={product.name} className="h-full w-full object-cover" /> : <Package className="h-6 w-6 text-gray-400" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{product.id.slice(0, 8)}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-600 dark:text-gray-400">{product.series || "—"}</td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                        {product.originalPrice && product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>}
                      </td>
                      <td className="p-4 text-center hidden lg:table-cell">
                        <span className={available(product) < 5 && available(product) > 0 ? "text-yellow-600" : available(product) === 0 ? "text-red-600" : "text-green-600"}>
                          {available(product)} / {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={product.status === "AVAILABLE" ? "success" : product.status === "LOW_STOCK" ? "warning" : product.status === "OUT_OF_STOCK" ? "danger" : product.status === "PRE_ORDER" ? "info" : "outline"}>
                          {product.isFeatured && "⭐ "}{product.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="View"><Eye className="h-4 w-4 text-gray-500" /></Link>
                          <Link href={`/admin/products/${product.id}/edit`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="Edit"><Edit className="h-4 w-4 text-gray-500" /></Link>
                          <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}