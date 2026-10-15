"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { X, Plus, Minus, Trash2, Truck, CheckCircle, Tag, XCircle } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { useState } from "react"
import { useToast } from "@/components/ui/Toaster"

export function CartDrawer() {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    isOpen, 
    setIsOpen,
    discount,
    applyDiscount,
    removeDiscount,
  } = useCart()
  const { toast } = useToast()
  // Shipping: 5€ for orders under 100€, free above
  const shippingCost = totalPrice > 0 && totalPrice < 10000 ? 500 : 0
  const freeShippingThreshold = 10000
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
  const [discountCode, setDiscountCode] = useState("")
  const [applyingDiscount, setApplyingDiscount] = useState(false)

  // Calculate discount amount (discount.value is percentage * 100 in DB, e.g., 15% = 1500)
  const discountAmount = discount ? (discount.type === "percentage" 
    ? Math.round(totalPrice * (discount.value / 100) / 100)  // e.g., 10000 * 1500 / 10000 = 1500 cents = €15
    : Math.min(discount.value, totalPrice)) : 0
  
  const subtotal = totalPrice
  const total = subtotal - discountAmount + shippingCost

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside
        className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-gray-950 shadow-xl flex flex-col"
        role="dialog"
        aria-label={siteConfig.cart.title.replace('{count}', totalItems.toString())}
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {siteConfig.cart.title.replace('{count}', totalItems.toString())}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={siteConfig.common.close}
          >
            <X className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
              <Truck className="h-12 w-12 mb-4 opacity-50" aria-hidden="true" />
              <p className="text-lg font-medium">{siteConfig.cart.empty}</p>
              <p className="text-sm mt-1">{siteConfig.cart.emptyDesc}</p>
              <Button
                className="mt-6"
                onClick={() => setIsOpen(false)}
                variant="primary"
              >
                {siteConfig.cart.continueShopping}
              </Button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatPrice(item.price)} each
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        // CORREGIDO: Añadido item.isVinted
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.isVinted)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        // CORREGIDO: Añadido item.isVinted
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.isVinted)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                      </button>
                      <button
                        // CORREGIDO: Añadido item.isVinted
                        onClick={() => removeItem(item.productId, item.isVinted)}
                        className="ml-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 hover:text-red-600"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {siteConfig.cart.subtotal.replace('{count}', items.reduce((s, i) => s + i.quantity, 0).toString())}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                
                {discount && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" aria-hidden="true" />
                      Discount ({discount.code})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">- {formatPrice(discountAmount)}</span>
                      <button
                        onClick={removeDiscount}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 hover:text-red-600"
                        aria-label="Remove discount"
                      >
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    {siteConfig.cart.shipping}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {shippingCost === 0 ? siteConfig.cart.freeShipping : formatPrice(shippingCost)}
                  </span>
                </div>
                {totalPrice > 0 && totalPrice < freeShippingThreshold && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    {siteConfig.cart.addForFree.replace('{amount}', formatPrice(remainingForFreeShipping))}
                  </p>
                )}
                <div className="flex justify-between text-base font-semibold border-t border-gray-200 dark:border-gray-800 pt-3">
                  <span className="text-gray-900 dark:text-white">{siteConfig.cart.total}</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
            {!discount ? (
              <div className="space-y-2">
                <Input
                  label="Discount Code"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="w-full"
                  disabled={applyingDiscount}
                />
                <Button 
                  className="w-full" 
                  variant="secondary" 
                  size="sm"
                  onClick={async () => {
                    if (!discountCode.trim()) return
                    setApplyingDiscount(true)
                    const result = await applyDiscount(discountCode.trim())
                    if (result.success) {
                      setDiscountCode("")
                      toast({ type: "success", title: "Discount applied!" })
                    } else {
                      toast({ type: "error", title: "Error", message: result.error })
                    }
                    setApplyingDiscount(false)
                  }}
                  disabled={applyingDiscount || !discountCode.trim()}
                >
                  {applyingDiscount ? "Applying..." : "Apply"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Discount <strong>{discount.code}</strong> applied. Remove to apply a different one.
              </p>
            )}
            <Button
              className="w-full h-12 text-lg"
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              {siteConfig.cart.continueShopping}
            </Button>
            <Link href="/checkout" className="block">
              <Button className="w-full h-12 text-lg" variant="primary">
                {siteConfig.cart.checkout.replace('{total}', formatPrice(total))}
              </Button>
            </Link>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-3.5 w-3.5 inline mr-1 text-green-500" aria-hidden="true" />
              {siteConfig.cart.secureCheckout}
            </p>
          </CardFooter>
        )}
      </aside>
    </>
  )
}