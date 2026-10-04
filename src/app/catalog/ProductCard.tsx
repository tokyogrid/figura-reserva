"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/Badge"
import { parseImages, formatPrice } from "@/lib/utils"
import { Package } from "lucide-react"

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

export function ProductCard({ product }: { product: Product }) {
  const images = parseImages(product.images)
  const inStock = product.stock - product.reserved > 0
  const available = product.stock - product.reserved

  return (
    <a href={`/catalog/${product.slug}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-12 w-12" aria-hidden="true" />
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="danger" className="text-lg px-4 py-2">Out of Stock</Badge>
            </div>
          )}
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2" variant="warning">
              ⭐ Featured
            </Badge>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          {product.series && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.series}</p>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {inStock && available < 5 && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              Only {available} left!
            </p>
          )}
        </div>
      </div>
    </a>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  )
}