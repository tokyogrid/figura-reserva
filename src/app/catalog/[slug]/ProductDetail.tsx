"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { formatPrice, cn, parseImages } from "@/lib/utils"
import { sanitizeHtml } from "@/lib/sanitize"
import { Truck, Shield, RotateCcw, Package, Check, Star, Scale, Calendar, Factory, Zap } from "lucide-react"

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

interface Props {
  product: Product
}

export function ProductDetail({ product }: Props) {
  const images = parseImages(product.images)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const inStock = product.stock - product.reserved > 0
  const available = product.stock - product.reserved
  const maxQty = Math.min(available, 5)

  const handleAddToCart = () => {
    if (!inStock) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || "",
      slug: product.slug,
    })
  }

  const specs = [
    { label: "Series", value: product.series, icon: Star },
    { label: "Character", value: product.character, icon: Package },
    { label: "Manufacturer", value: product.manufacturer, icon: Factory },
    { label: "Scale", value: product.scale, icon: Scale },
    { label: "Category", value: product.category, icon: Package },
    { label: "Release", value: product.releaseDate ? new Date(product.releaseDate).toLocaleDateString("en-US") : null, icon: Calendar },
  ].filter((s) => s.value)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400" aria-label="Navigation">
          <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
          <span>/</span>
          <a href="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400">Catalog</a>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="h-24 w-24" aria-hidden="true" />
                </div>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="danger" className="text-xl px-6 py-3">Out of Stock</Badge>
                </div>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4" variant="warning">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                      index === selectedImage
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === selectedImage ? "true" : "false"}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - vista ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-contain"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {product.series && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{product.series}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="line-through">{formatPrice(product.originalPrice)}</span>
                )}
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {inStock && available < 5 && (
                <Badge variant="warning" className="gap-1">
                  <Package className="h-3 w-3" aria-hidden="true" />
                  Only {available} left
                </Badge>
              )}
              {product.status === "PRE_ORDER" && (
                <Badge variant="info">Pre-order</Badge>
              )}
              {product.status === "LOW_STOCK" && (
                <Badge variant="warning">Low stock</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
              </div>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Especificaciones</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex items-start gap-3">
                        <spec.icon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{spec.label}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add to cart / Buy Now */}
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-6">
                <div className="space-y-4">
<div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
                          min={1}
                          max={maxQty}
                          className="w-20 text-center border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!inStock}
                        />
                        <button
                          onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                          disabled={quantity >= maxQty}
                          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                      {maxQty < 5 && inStock && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max {maxQty} unit{maxQty !== 1 ? "s" : ""} available</p>
                      )}
                    </div>

                  <div className="space-y-3">
                    {/* Buy Now - In Stock */}
                    {inStock ? (
                      <Button
                        onClick={handleAddToCart}
                        className="w-full h-12 text-lg"
                        variant="primary"
                      >
                        <Zap className="h-4 w-4" aria-hidden="true" />
                        Buy Now - Fast Shipping
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full h-12 text-lg"
                        variant="secondary"
                      >
                        <span className="flex items-center gap-2">
                          <Truck className="h-4 w-4" aria-hidden="true" />
                          Available in 10-15 days
                        </span>
                      </Button>
                    )}

                    {/* Reserve Option */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      className="w-full h-12 text-lg"
                      variant="secondary"
                    >
                      {inStock ? "Reserve now" : "Notify when available"}
                    </Button>

                    <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" aria-hidden="true" />
                        <span>Envío 4,99€ (gratis &gt;100€)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        <span>Secure Stripe payment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        <span>Devolución 14 días</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Check className="h-8 w-8 text-green-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Auténticas</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bought from official JP stores</p>
              </div>
              <div className="p-4">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Secure</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Refund if we can	 get the figure</p>
              </div>
              <div className="p-4">
                <Truck className="h-8 w-8 text-purple-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Rápido</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Envío 24-48h tras recibirla</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
