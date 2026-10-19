"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice, parseImages } from "@/lib/utils"
import { Package, Truck, Zap, Sparkles, Tag } from "lucide-react"

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
  releaseDate?: string | null
  stock: number
  reserved: number
  status: string
  isFeatured: boolean
  createdAt?: string
  updatedAt?: string
}

interface ProductCardProps {
  product: Product
  className?: string
  style?: React.CSSProperties
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  const images = parseImages(product.images)
  const inStock = product.stock - product.reserved > 0
  const available = product.stock - product.reserved
  const isLowStock = inStock && available <= 3
  const isOutOfStock = !inStock
  const isNew = product.createdAt ? (Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000) : false

  return (
    <Link href={`/catalog/${product.slug}`} className={`group block ${className || ""}`} style={style}>
      <Card className={`relative overflow-hidden h-full transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] group-hover:-translate-y-2 group-hover:border-purple-500/30 border-gray-800 bg-gray-900/50 backdrop-blur-sm ${className || ""}`} style={style}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={product.name}
              width={400}
              height={500}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              quality={90}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <Package className="h-16 w-16" aria-hidden="true" />
            </div>
          )}
          {/* Dark overlay for text readability on light images */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {!inStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <Badge variant="danger" className="text-lg px-4 py-2">Out of Stock</Badge>
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="warning" className="gap-1">
                <Zap className="h-3 w-3" />
                Only {available} left
              </Badge>
            </div>
          )}
          {product.createdAt && (Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-2 left-2 z-10 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1">
                <span className="relative z-10">🔥 NEW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-50 animate-ping" />
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 relative z-10 bg-gradient-to-t from-gray-950/95 via-gray-900/80 to-transparent">
          <div className="flex items-center justify-between mb-2">
            {product.series && (
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">{product.series}</span>
            )}
            <div className="flex items-center gap-1">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Reserve
              </Badge>
            </div>
          </div>
          <h3 className="font-bold text-white truncate group-hover:text-purple-400 transition-colors text-lg">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <span className="text-xl font-bold text-white drop-shadow-lg">
              {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(product.price / 100)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(product.originalPrice / 100)}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {inStock ? (
              <>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  In Stock
                </Badge>
                {isLowStock && (
                  <Badge variant="warning" className="gap-1">
                    <span className="text-xs">{available} left</span>
                  </Badge>
                )}
              </>
            ) : (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Tag className="h-3 w-3" />
                10-15 days
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="group block">
      <Card className="relative overflow-hidden h-full transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] group-hover:-translate-y-2 group-hover:border-purple-500/30 border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
          <div className="w-full h-full bg-gray-800 animate-pulse" />
        </div>
        <CardContent className="p-4 space-y-3 bg-gradient-to-t from-gray-950/95 via-gray-900/80 to-transparent">
          <div className="h-4 w-24 bg-gray-800 rounded-full animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-1/3 bg-gray-800 rounded animate-pulse" />
          <div className="h-5 w-20 bg-gray-800 rounded-full animate-pulse" />
        </CardContent>
      </Card>
    </div>
  )
}
