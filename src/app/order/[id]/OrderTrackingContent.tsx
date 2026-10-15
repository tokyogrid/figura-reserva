"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import { Truck, Mail, User, MapPin, Phone, CreditCard, Clock, CheckCircle, Package, Sparkles, ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, VINTED_ORDER_STATUS_LABELS, VINTED_ORDER_STATUS_COLORS } from "@/lib/utils"

interface Order {
  id: string
  customerName: string
  email: string
  phone: string | null
  address: string
  city: string
  postalCode: string
  country: string
  subtotal: number
  shippingCost: number
  total: number
  status: string
  paymentStatus: string
  stripeSessionId: string | null
  notes: string | null
  isVintedOrder: boolean
  createdAt: string
  updatedAt: string
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string
      slug: string
    }
  }>
}

interface Props {
  order: Order
}

const statusOrder = [
  "PENDING",
  "CONFIRMED",
  "PURCHASING_IN_JAPAN",
  "SHIPPED",
  "DELIVERED",
]

const vintedStatusOrder = [
  "PENDING",
  "CONFIRMED",
  "PURCHASING_IN_JAPAN",
  "AVAILABLE_ON_VINTED",
]

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PURCHASING_IN_JAPAN: Sparkles,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  AVAILABLE_ON_VINTED: Package,
}

const statusDescriptions: Record<string, string> = {
  PENDING: "Waiting for payment confirmation",
  CONFIRMED: "Payment confirmed, preparing purchase in Japan",
  PURCHASING_IN_JAPAN: "Buying figure from Japanese stores",
  SHIPPED: "Figure received in Spain and shipped to you",
  DELIVERED: "Order delivered! Enjoy your figure",
  AVAILABLE_ON_VINTED: "Figure listed on Vinted, ready for you to complete purchase",
}

const vintedStatusDescriptions: Record<string, string> = {
  PENDING: "Waiting for payment confirmation",
  CONFIRMED: "Payment confirmed, preparing purchase in Japan",
  PURCHASING_IN_JAPAN: "Buying figure from Japanese stores",
  AVAILABLE_ON_VINTED: "Figure listed on Vinted, ready for you to complete purchase",
}

export function OrderTrackingContent({ order }: Props) {
  const isVinted = order.isVintedOrder
  const currentStatusOrder = isVinted ? vintedStatusOrder : statusOrder
  const currentStatusDescriptions = isVinted ? vintedStatusDescriptions : statusDescriptions
  const currentStatusLabels = isVinted ? VINTED_ORDER_STATUS_LABELS : ORDER_STATUS_LABELS
  const currentStatusColors = isVinted ? VINTED_ORDER_STATUS_COLORS : ORDER_STATUS_COLORS
  const currentStatusIndex = currentStatusOrder.indexOf(order.status)
  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED"
  const isFinalCompleted = !isVinted && order.status === "DELIVERED" || isVinted && order.status === "AVAILABLE_ON_VINTED"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Tracking</h1>
            <p className="text-gray-600 dark:text-gray-300">Order <strong>#{order.id.slice(0, 8)}</strong> • {new Date(order.createdAt).toLocaleDateString()}</p>
            {isVinted && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Vinted Order - You will complete the purchase on Vinted</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" aria-hidden="true" />
              {isVinted ? "Vinted Purchase Status" : "Shipping Status"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-8">
                {currentStatusOrder.map((status, index) => {
                  const Icon = statusIcons[status as keyof typeof statusIcons]
                  const isActive = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex && !isCancelled && !isFinalCompleted
                  const isCompleted = index < currentStatusIndex || (isFinalCompleted && index === currentStatusIndex)

                  return (
                    <div key={status} className="relative flex items-start gap-4">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" aria-hidden="true" />
                        ) : isCurrent ? (
                          <Icon className="h-6 w-6 text-blue-600 animate-pulse" aria-hidden="true" />
                        ) : (
                          <Icon className="h-6 w-6 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                        )}
                        <div className="absolute -left-1.5 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                            {currentStatusLabels[status] || status}
                          </h3>
                          {isCurrent && (
                            <Badge variant="info" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {currentStatusDescriptions[status] || status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {!isVinted && order.status === "SHIPPED" && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Shipping Information
                </h4>
                <p className="text-blue-700 dark:text-blue-300">Your package is on the way. You'll receive the tracking number by email.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order items */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" aria-hidden="true" />
              Figures in Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => {
                const images = item.product.images ? JSON.parse(item.product.images) : []
                return (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {images[0] ? (
                        <img src={images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-8 w-8 mx-auto my-auto text-gray-400" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/catalog/${item.product.slug}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-6 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatPrice(order.subtotal)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Shipping</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Paid</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(order.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" aria-hidden="true" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</p>
              <address className="not-italic text-gray-900 dark:text-white">
                {order.address}<br />
                {order.postalCode} {order.city}<br />
                {order.country}
              </address>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Need Help?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Reply to the confirmation email or write to <a href="mailto:support@tokyogrid.com" className="underline">support@tokyogrid.com</a>. We reply within 24h.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => window.open(`mailto:support@tokyogrid.com?subject=Order ${order.id.slice(0, 8)}`)} className="gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact Support
              </Button>
              {order.phone && (
                <Button variant="outline" onClick={() => {
                  const phone = order.phone?.replace(/\D/g, "")
                  if (phone) window.open(`https://wa.me/${phone}`)
                }} className="gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}