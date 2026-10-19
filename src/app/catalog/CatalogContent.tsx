"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Filter, X, Package, ChevronDown, Search, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { fadeInUp, staggerContainer, staggerItem, cardEntrance, animationClasses } from "@/lib/animations"

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
  isHidden: boolean
  isUnpurchasable: boolean
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
  const [appliedSeries, setAppliedSeries] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const initializedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProducts = useCallback(async (params: {
    search?: string
    category?: string
    series?: string
    inStockOnly?: boolean
    sort?: string
    page?: number
  }) => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setLoading(true)
      const p = new URLSearchParams()
      if (params.search !== undefined) p.set("search", params.search)
      if (params.category !== undefined) p.set("category", params.category)
      if (params.series !== undefined) p.set("series", params.series)
      if (params.inStockOnly !== undefined && params.inStockOnly) p.set("inStock", "true")
      if (params.sort !== undefined) p.set("sort", params.sort)
      if (params.page !== undefined) p.set("page", String(params.page))

      const res = await fetch(`/api/products?${p}`, { signal: controller.signal })
      const data = await res.json()
      
      // Ignore if this request was aborted
      if (controller.signal.aborted) return
      
      setProducts(data.products || [])
      setCategories(data.categories || [])
      setSeriesList(data.series || [])
      setTotalPages(data.totalPages || 1)
      if (params.series !== undefined) {
        setAppliedSeries(params.series)
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === "AbortError") return
      console.error("Error fetching products:", error)
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Initialize from URL params on mount
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    
    const urlParams = new URLSearchParams(window.location.search)
    const initialSearch = urlParams.get("search") || ""
    const initialCategory = urlParams.get("category") || ""
    const initialSeries = urlParams.get("series") || ""
    const initialInStock = urlParams.get("inStock") === "true"
    const initialSort = urlParams.get("sort") || "featured"
    const initialPage = parseInt(urlParams.get("page") || "1")
    
    if (initialSearch || initialCategory || initialSeries || initialInStock || initialSort !== "featured") {
      setSearch(initialSearch)
      setCategory(initialCategory)
      setSeries(initialSeries)
      setInStockOnly(initialInStock)
      setSort(initialSort)
      setPage(initialPage)
      fetchProducts({ search: initialSearch, category: initialCategory, series: initialSeries, inStockOnly: initialInStock, sort: initialSort, page: initialPage })
    } else {
      fetchProducts({ page: initialPage })
    }
  }, [fetchProducts])

  // Auto-fetch when filters change (reset to page 1)
  useEffect(() => {
    if (initializedRef.current) {
      setPage(1)
      fetchProducts({ search, category, series, inStockOnly, sort, page: 1 })
    }
  }, [search, category, series, inStockOnly, sort, fetchProducts])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts({ search: value, category, series, inStockOnly, sort })
    }, 300)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    fetchProducts({ search, category: value, series, inStockOnly, sort })
  }

  const handleSeriesChange = (value: string) => {
    setSeries(value)
    fetchProducts({ search, category, series: value, inStockOnly, sort })
  }

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    fetchProducts({ search, category, series, inStockOnly: checked, sort })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    fetchProducts({ search, category, series, inStockOnly, sort: value })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    fetchProducts({ search, category, series, inStockOnly, sort, page: newPage })
    // Update URL
    const params = new URLSearchParams(window.location.search)
    params.set("page", String(newPage))
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`)
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("")
    setSeries("")
    setInStockOnly(false)
    setSort("featured")
    setAppliedSeries("")
    fetchProducts({})
    window.history.replaceState({}, "", window.location.pathname)
  }

  const hasFilters = search || category || series || inStockOnly

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  const showNoResults = !loading && products.length === 0
  const showNoResultsForSeries = showNoResults && appliedSeries
  const showNoResultsForSearch = showNoResults && (search || category || inStockOnly)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            {siteConfig.catalog.title}
          </h1>
          <p className="text-gray-400 mt-1">
            {siteConfig.catalog.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className={cn("space-y-4 transition-all duration-300", showFilters ? "" : "hidden md:block")}>
          <form className="space-y-4 md:grid md:grid-cols-5 md:gap-4 md:items-end">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
              <Input
                placeholder={siteConfig.catalog.searchPlaceholder}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <Select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                options={[{ value: "", label: siteConfig.catalog.categoryPlaceholder }, ...categories.map((c) => ({ value: c, label: c }))]}
                placeholder={siteConfig.catalog.categoryPlaceholder}
                className="bg-gray-900/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <Select
                value={series}
                onChange={(e) => handleSeriesChange(e.target.value)}
                options={[{ value: "", label: siteConfig.catalog.seriesPlaceholder }, ...seriesList.map((s) => ({ value: s, label: s }))]}
                placeholder={siteConfig.catalog.seriesPlaceholder}
                className="bg-gray-900/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => handleInStockChange(e.target.checked)}
                  className="rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-900"
                />
                <span className="text-sm text-gray-300">{siteConfig.catalog.inStockOnly}</span>
              </label>
              <Select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                options={siteConfig.catalog.sortOptions}
                placeholder="Sort"
                className="bg-gray-900/50 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </form>

          {hasFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {search && (
                <Badge variant="outline" className="gap-1 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Search: "{search}"
                  <button
                    type="button"
                    onClick={() => { setSearch(""); fetchProducts({ search: "", category, series, inStockOnly, sort }); }}
                    className="ml-1 hover:text-pink-400"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {category && (
                <Badge variant="outline" className="gap-1 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Category: {category}
                  <button
                    type="button"
                    onClick={() => { setCategory(""); fetchProducts({ search, category: "", series, inStockOnly, sort }); }}
                    className="ml-1 hover:text-pink-400"
                    aria-label="Clear category"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {series && (
                <Badge variant="outline" className="gap-1 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Series: {series}
                  <button
                    type="button"
                    onClick={() => { setSeries(""); fetchProducts({ search, category, series: "", inStockOnly, sort }); }}
                    className="ml-1 hover:text-pink-400"
                    aria-label="Clear series"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="outline" className="gap-1 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700" onClick={() => { setInStockOnly(false); fetchProducts({ search, category, series, inStockOnly: false, sort }); }}>
                  {siteConfig.catalog.inStockOnly} <X className="h-3 w-3 ml-1" aria-hidden="true" />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
                {siteConfig.catalog.clearFilters}
              </Button>
            </div>
          )}
        </div>

        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full gap-2 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filters {hasFilters && <span className="text-purple-400">({Object.values({search, category, series, inStockOnly}).filter(Boolean).length})</span>}
            <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} aria-hidden="true" />
          </Button>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {loading ? siteConfig.catalog.loading : `${products.length} figure${products.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : showNoResultsForSeries ? (
          <div className="text-center py-16 animate-fade-in">
            <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-medium text-white mb-2">No figures found for "{appliedSeries}"</h3>
            <p className="text-gray-500 mb-6">We don't have any figures from this series in our catalog yet.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" onClick={clearFilters} className="gap-2 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Clear Filter
              </Button>
              <Link href="/request">
                <Button variant="primary" className="gap-2 w-full sm:w-auto" size="lg">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Request Figure
                </Button>
              </Link>
            </div>
          </div>
        ) : showNoResultsForSearch ? (
          <div className="text-center py-16 animate-fade-in">
            <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-medium text-white mb-2">No figures match your search</h3>
            <p className="text-gray-500 mb-6">We couldn't find any figures matching "{search || category || (inStockOnly ? 'in stock only' : '')}".</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" onClick={clearFilters} className="gap-2 bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Clear Filters
              </Button>
              <Link href="/request" className="w-full sm:w-auto">
                <Button variant="primary" className="gap-2 w-full sm:w-auto" size="lg">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Request Figure
                </Button>
              </Link>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-medium text-white mb-2">{siteConfig.catalog.noResults}</h3>
            <p className="text-gray-500 mb-6">{siteConfig.catalog.noResultsDesc}</p>
            <Button variant="outline" onClick={clearFilters} className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700">{siteConfig.catalog.clearFilters}</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={staggerContainer}>
            {products.filter(p => !p.isHidden).map((product, index) => (
              <div key={product.id} style={staggerItem}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
              className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={page === p ? "page" : undefined}
                className={page === p ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700"}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
              className="bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </nav>
        )}
        <p className="mt-4 text-center text-sm text-gray-500">
          Page {page} of {totalPages} &mdash; {products.length} of {products.length > 0 ? (page === totalPages ? totalPages * 20 - (totalPages * 20 - products.length) : products.length) : 0} figures
        </p>
      </div>
    </div>
  )
}