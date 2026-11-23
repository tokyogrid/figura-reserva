"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { formatPrice, cn } from "@/lib/utils"
import { sanitizeHtml } from "@/lib/sanitize"
import { Truck, Shield, RotateCcw, Package, Check, Zap, Tag, Sparkles } from "lucide-react"

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
  isUnpurchasable?: boolean
  isHidden?: boolean
}

interface ProductDetailContentProps {
  product: Product
  images: string[]
  selectedImage: number
  setSelectedImage: (index: number) => void
  quantity: number
  setQuantity: (qty: number) => void
  addItem: (item: { productId: string; name: string; price: number; image: string; slug: string; isVinted?: boolean }) => void
}

function handleAddToCart(
  inStock: boolean,
  images: string[],
  product: Product,
  addItem: (item: { productId: string; name: string; price: number; image: string; slug: string; isVinted?: boolean }) => void,
  isVinted = false
) {
  if (!inStock && !isVinted) return
  if (product.isUnpurchasable) return
  
  const price = isVinted ? Math.round(product.price / 2) : product.price
  
  addItem({
    productId: product.id,
    name: product.name,
    price: price,
    image: images[0] || "",
    slug: product.slug,
    isVinted,
  })
}

export const ProductDetailContent = ({
  product,
  images,
  selectedImage,
  setSelectedImage,
  quantity,
  setQuantity,
  addItem,
}: ProductDetailContentProps) => {
  const available = product.stock - product.reserved
  const inStock = available > 0
  const maxQty = Math.min(inStock ? available : 0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400" aria-label="Navigation">
          <a href="/" className="hover:text-purple-400">Home</a>
          <span>/</span>
          <a href="/catalog" className="hover:text-purple-400">Catalog</a>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-900">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  width={800}
                  height={1000}
                  className="object-cover w-full h-full"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Package className="h-24 w-24" aria-hidden="true" />
                </div>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Badge variant="danger" className="text-lg px-6 py-3">Out of Stock - Pre-order Available</Badge>
                </div>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
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
                      index === selectedImage ? "border-purple-500" : "border-transparent hover:border-gray-600"
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === selectedImage ? "true" : "false"}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - vista ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {product.series && (
                <p className="text-sm text-purple-400 font-medium mb-1">{product.series}</p>
              )}
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="line-through text-gray-500">{formatPrice(product.originalPrice)}</span>
                )}
                <span className="text-2xl font-bold text-white drop-shadow-lg">{formatPrice(product.price)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {inStock && available < 5 && (
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Package className="h-3 w-3" aria-hidden="true" />
                  Only {available} left
                </span>
              )}
              {!inStock && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Package className="h-3 w-3" aria-hidden="true" />
                  Out of Stock - Available for Pre-order
                </span>
              )}
              {product.status === "PRE_ORDER" && (
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium">Pre-order</span>
              )}
              {product.status === "LOW_STOCK" && inStock && (
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">Low stock</span>
              )}
              {product.isUnpurchasable && (
                <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  Not purchasable
                </span>
              )}
              {product.isHidden && (
                <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">Hidden from catalog</span>
              )}
            </div>

            {product.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
              </div>
            )}

            {(() => {
              const specsArray = [
                { label: "Series", value: product.series },
                { label: "Character", value: product.character },
                { label: "Manufacturer", value: product.manufacturer },
                { label: "Scale", value: product.scale },
                { label: "Category", value: product.category },
                { label: "Release", value: product.releaseDate ? new Date(product.releaseDate).toLocaleDateString("en-US") : null },
              ]
              const specs = specsArray.filter((s) => s.value !== null)
              if (specs.length === 0) return null
              return (
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Especificaciones</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-gray-500">{spec.label}</p>
                          <p className="text-sm font-medium text-white">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !inStock}
                      className="flex h-10 w-10 items-center justify-center border border-gray-700 rounded-lg bg-gray-900/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Disminuir cantidad"
                    >
                      <span style={{ display: "block", width: "16px", height: "3px", backgroundColor: "#ffffff" }} />
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
                      min={1}
                      max={maxQty}
                      className="w-20 h-10 text-center border border-gray-700 rounded-lg py-2 px-3 text-white bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={!inStock}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                      disabled={quantity >= maxQty || !inStock}
                      className="relative flex h-10 w-10 items-center justify-center border border-gray-700 rounded-lg bg-gray-900/50 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Aumentar cantidad"
                    >
                      <span style={{ position: "absolute", width: "16px", height: "3px", backgroundColor: "#ffffff", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                      <span style={{ position: "absolute", width: "3px", height: "16px", backgroundColor: "#ffffff", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                    </button>
                  </div>
                  {maxQty > 0 && maxQty < 5 && inStock && (
                    <p className="text-xs text-gray-400 mt-1">Máx. {maxQty} unidad{maxQty !== 1 ? "es" : ""} disponible{maxQty !== 1 ? "s" : ""}</p>
                  )}
                  {!inStock && (
                    <p className="text-xs text-gray-400 mt-1">Agotado - Pre-order disponible</p>
                  )}
                </div>

                <div className="space-y-3">
                  {inStock && !product.isUnpurchasable ? (
                    <>
                      <Button
                        onClick={() => handleAddToCart(true, images, product, addItem, false)}
                        className="w-full h-12 text-lg"
                        variant="primary"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-4 w-4 rounded bg-white/20">
                            <Zap className="h-4 w-4" aria-hidden="true" />
                          </span>
                          Comprar ahora - Envío rápido (1-3 días)
                        </span>
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(true, images, product, addItem, true)}
                        className="w-full h-12 text-lg"
                        variant="secondary"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-4 w-4 rounded bg-white/20">
                            <Tag className="h-4 w-4" aria-hidden="true" />
                          </span>
                          Comprar vía Vinted (50% ahora, 50% en Vinted)
                        </span>
                      </Button>
                    </>
                  ) : product.isUnpurchasable ? (
                    <div className="w-full h-12 text-lg bg-gray-800/50 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                      No disponible para compra
                    </div>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleAddToCart(true, images, product, addItem, false)}
                        className="w-full h-12 text-lg"
                        variant="primary"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-4 w-4 rounded bg-white/20">
                            <Truck className="h-4 w-4" aria-hidden="true" />
                          </span>
                          Comprar (10-20 días)
                        </span>
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(true, images, product, addItem, true)}
                        className="w-full h-12 text-lg"
                        variant="secondary"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex items-center justify-center h-4 w-4 rounded bg-white/20">
                            <Package className="h-4 w-4" aria-hidden="true" />
                          </span>
                          Comprar vía Vinted (50% ahora, 50% en Vinted)
                        </span>
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-400 pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    <span>Envío 4,99€ (gratis >100€)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    <span>Pago seguro con Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>Devoluciones 14 días</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-2">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="font-medium text-white">Auténtico</p>
                <p className="text-xs text-gray-500">Comprado en tiendas oficiales JP</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 mb-2">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="font-medium text-white">Seguro</p>
                <p className="text-xs text-gray-500">Reembolso si no conseguimos la figura</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-2">
                  <Truck className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="font-medium text-white">Rápido</p>
                <p className="text-xs text-gray-500">Enviado 24-48h tras recibirla</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}