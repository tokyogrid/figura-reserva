"use client"

import { useState, useEffect } from "react"
import { ProductCard, ProductCardSkeleton } from "./ProductCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Filter, X, Package, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  originalPrice: number | null
  images: string
  category: string | null
  series: string | null
  character: string | null
  manufacturer: string | null
  scale: string | null
  stock: number
  reserved: number
  status: string
  isFeatured: boolean
}

export function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [series, setSeries] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState("featured")
  const [categories, setCategories] = useState<string[]>([])
  const [seriesList, setSeriesList] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (category) params.set("category", category)
      if (series) params.set("series", series)
      if (inStockOnly) params.set("inStock", "true")
      params.set("sort", sort)

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products)
      setCategories(data.categories)
      setSeriesList(data.series)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setSeries("")
    setInStockOnly(false)
    fetchProducts()
  }

  const hasFilters = search || category || series || inStockOnly

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{siteConfig.catalog.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {siteConfig.catalog.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className={cn("space-y-4 transition-all duration-300", showFilters ? "" : "hidden md:block")}>
          <form onSubmit={handleSearch} className="space-y-4 md:grid md:grid-cols-5 md:gap-4 md:items-end">
            <div className="md:col-span-2">
              <Input
                placeholder={siteConfig.catalog.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[{ value: "", label: siteConfig.catalog.categoryPlaceholder }, ...categories.map((c) => ({ value: c, label: c }))]}
                placeholder={siteConfig.catalog.categoryPlaceholder}
              />
            </div>
            <div>
              <Select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                options={[{ value: "", label: siteConfig.catalog.seriesPlaceholder }, ...seriesList.map((s) => ({ value: s, label: s }))]}
                placeholder={siteConfig.catalog.seriesPlaceholder}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{siteConfig.catalog.inStockOnly}</span>
              </label>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                options={siteConfig.catalog.sortOptions}
                placeholder="Sort"
              />
            </div>
          </form>

          {hasFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {search && (
                <Badge variant="outline" className="gap-1">
                  Search: "{search}"
                  <button
                    type="button"
                    onClick={() => { setSearch(""); fetchProducts(); }}
                    className="ml-1 hover:text-red-600"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {category && (
                <Badge variant="outline" className="gap-1">
                  Category: {category}
                  <button
                    type="button"
                    onClick={() => { setCategory(""); fetchProducts(); }}
                    className="ml-1 hover:text-red-600"
                    aria-label="Clear category"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {series && (
                <Badge variant="outline" className="gap-1">
                  Series: {series}
                  <button
                    type="button"
                    onClick={() => { setSeries(""); fetchProducts(); }}
                    className="ml-1 hover:text-red-600"
                    aria-label="Clear series"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="outline" className="gap-1" onClick={() => { setInStockOnly(false); fetchProducts(); }}>
                  {siteConfig.catalog.inStockOnly} <X className="h-3 w-3 ml-1" aria-hidden="true" />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {siteConfig.catalog.clearFilters}
              </Button>
            </div>
          )}
        </div>

        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filters {hasFilters && <span className="text-blue-600">({Object.values({search,category,series,inStockOnly}).filter(Boolean).length})</span>}
            <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} aria-hidden="true" />
          </Button>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? siteConfig.catalog.loading : `${products.length} figure${products.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{siteConfig.catalog.noResults}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{siteConfig.catalog.noResultsDesc}</p>
            <Button variant="outline" onClick={clearFilters}>{siteConfig.catalog.clearFilters}</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}