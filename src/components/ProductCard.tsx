"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice, parseImages } from "@/lib/utils"
import { Package, Truck, Zap } from "lucide-react"

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
  releaseDate: string | null
  stock: number
  reserved: number
  status: string
  isFeatured: boolean
}

export function ProductCard({ product }: { product: Product }) {
  const images = parseImages(product.images)
  const inStock = product.stock - product.reserved > 0
  const available = product.stock - product.reserved
  const isLowStock = inStock && available <= 3
  const isOutOfStock = !inStock

  return (
    <Link href={`/catalog/${product.slug}`} className="group block">
      <Card className="overflow-hidden h-full transition-shadow group-hover:shadow-xl">
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
          {isLowStock && (
            <Badge className="absolute top-2 right-2" variant="warning">
              Only {available} left
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          {product.series && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.series}</p>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {inStock ? (
              <>
                <Badge variant="success" className="gap-1">
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
              <Badge variant="secondary" className="gap-1">
                <span className="text-xs">10-15 days</span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
