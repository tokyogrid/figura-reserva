"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils"
import { CheckCircle, Truck, Mail, Clock, Package, Sparkles, ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { useCart } from "@/lib/cart-context"

interface Order {
  id: string
  customerName: string
  email: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    quantity: number
    price: number
    product: {
      name: string
      images: string
    }
  }>
}

interface Props {
  order: Order | null
}

export function CheckoutSuccessContent({ order }: Props) {
  const [mounted, setMounted] = useState(false)
  const { clearCart } = useCart()

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (mounted && order) {
      clearCart()
    }
  }, [mounted, order, clearCart])

  if (!mounted) return null

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your reservation has been processed. Check your email for details.
          </p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = order.items.map(item => JSON.parse(item.product.images))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container max-w-3xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{siteConfig.checkoutSuccess.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Hi {order.customerName}, your order <strong>#{order.id.slice(0, 8)}</strong> is confirmed.
          </p>
        </div>

        {/* Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status</h2>
              <Badge className={ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}>
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </Badge>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Confirmation Sent</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">To {order.email}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Next Step</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Buying in Japan (1-2 weeks)</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Est. Shipping</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2-3 weeks total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order items */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reserved Figures</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {images[index]?.[0] ? (
                      <img src={images[index][0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="h-8 w-8 mx-auto my-auto text-gray-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total Paid</span>
              <span className="text-gray-900 dark:text-white">{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              {siteConfig.checkoutSuccess.whatHappensNext}
            </h2>
            <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              {siteConfig.checkoutSuccess.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
              We'll notify you by email at each step. Questions? Reply to the confirmation email.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog">
            <Button variant="outline" className="w-full sm:w-auto">
              {siteConfig.checkoutSuccess.continueShopping}
            </Button>
          </Link>
          <Link href={`/order/${order.id}`}>
            <Button variant="primary" className="w-full sm:w-auto">
              {siteConfig.checkoutSuccess.viewOrder}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}