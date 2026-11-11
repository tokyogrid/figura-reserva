"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import { Truck, Mail, User, MapPin, Phone, CreditCard, Clock, CheckCircle, Package, Sparkles, ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, VINTED_ORDER_STATUS_LABELS, VINTED_ORDER_STATUS_COLORS, getContactEmail } from "@/lib/utils"

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
  PENDING: "Esperando confirmación de pago",
  CONFIRMED: "Pago confirmado, preparando compra en Japón",
  PURCHASING_IN_JAPAN: "Comprando figura en tiendas japonesas",
  SHIPPED: "Figura recibida en España y enviada a ti",
  DELIVERED: "¡Pedido entregado! Disfruta tu figura",
  AVAILABLE_ON_VINTED: "Figura listada en Vinted, listo para que completes la compra",
}

const vintedStatusDescriptions: Record<string, string> = {
  PENDING: "Esperando confirmación de pago",
  CONFIRMED: "Pago confirmado, preparando compra en Japón",
  PURCHASING_IN_JAPAN: "Comprando figura en tiendas japonesas",
  AVAILABLE_ON_VINTED: "Figura listada en Vinted, listo para que completes la compra",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Volver al Inicio
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Seguimiento de Pedido</h1>
            <p className="text-gray-300">Pedido <strong>#{order.id.slice(0, 8)}</strong> • {new Date(order.createdAt).toLocaleDateString()}</p>
            {isVinted && (
              <p className="text-sm text-purple-400 mt-1">Pedido Vinted - Completarás la compra en Vinted</p>
            )}
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Truck className="h-5 w-5" aria-hidden="true" />
              {isVinted ? "Estado de Compra Vinted" : "Estado de Envío"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-800/50" />
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
                          <Icon className="h-6 w-6 text-purple-400 animate-pulse" aria-hidden="true" />
                        ) : (
                          <Icon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                        )}
                        <div className="absolute -left-1.5 top-12 bottom-0 w-0.5 bg-gray-800/50" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isActive ? "text-white" : "text-gray-400"}`}>
                            {currentStatusLabels[status] || status}
                          </h3>
                          {isCurrent && (
                            <Badge variant="info" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">Actual</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {currentStatusDescriptions[status] || status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {!isVinted && order.status === "SHIPPED" && (
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Información de Envío
                </h4>
                <p className="text-purple-300">Tu paquete está en camino. Recibirás el número de seguimiento por email.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order items */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Package className="h-5 w-5" aria-hidden="true" />
              Figuras del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => {
                const images = item.product.images ? JSON.parse(item.product.images) : []
                return (
                  <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-gray-800/50 bg-gray-900/30">
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                      {images[0] ? (
                        <img src={images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-8 w-8 mx-auto my-auto text-gray-500" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/catalog/${item.product.slug}`} className="font-medium text-white hover:text-purple-400">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-400">
                        Cantidad: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800/50 flex justify-end space-x-6 text-sm">
              <div>
                <p className="text-gray-400">Subtotal</p>
                <p className="font-medium text-white">{formatPrice(order.subtotal)}</p>
              </div>
              <div>
                <p className="text-gray-400">Envío</p>
                <p className="font-medium text-white">
                  {order.shippingCost === 0 ? "Gratis" : formatPrice(order.shippingCost)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Total Pagado</p>
                <p className="font-bold text-lg text-white">{formatPrice(order.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer info */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" aria-hidden="true" />
              Tu Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Nombre</p>
                <p className="font-medium text-white">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white">{order.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Dirección de Envío</p>
              <address className="not-italic text-white">
                {order.address}<br />
                {order.postalCode} {order.city}<br />
                {order.country}
              </address>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              ¿Necesitas Ayuda?
            </h3>
            <p className="text-purple-300 mb-4">
              Responde al email de confirmación o escribe a {getContactEmail() ? <a href={`mailto:${getContactEmail()}`} className="underline">{getContactEmail()}</a> : <a href="/contact" className="underline">Contactar Soporte</a>}. Respondemos en 24h.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => getContactEmail() ? window.open(`mailto:${getContactEmail()}?subject=Pedido ${order.id.slice(0, 8)}`) : window.open(`/contact`)} className="gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contactar Soporte
              </Button>
              {order.phone && (
                <Button variant="outline" onClick={() => {
                  const phone = order.phone?.replace(/\D/g, "")
                  if (phone) window.open(`https://wa.me/${phone}`)
                }} className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
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