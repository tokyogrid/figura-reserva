"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Search, Filter, ChevronDown, Truck, RotateCcw, Eye } from "lucide-react"
import { formatPrice } from "@/lib/utils"

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
  vintedCode: string | null
  createdAt: string
  updatedAt: string
  items: Array<{
    quantity: number
    price: number
    isVinted: boolean
    product: {
      name: string
      images: string
      slug: string
    }
  }>
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PURCHASING_IN_JAPAN: "Purchasing in Japan",
  AVAILABLE_ON_VINTED: "Available on Vinted",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PURCHASING_IN_JAPAN: "bg-purple-100 text-purple-800",
  AVAILABLE_ON_VINTED: "bg-pink-100 text-pink-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

const VINTED_ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PURCHASING_IN_JAPAN: "Purchasing in Japan",
  AVAILABLE_ON_VINTED: "Available on Vinted",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
}

const VINTED_ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PURCHASING_IN_JAPAN: "bg-purple-100 text-purple-800",
  AVAILABLE_ON_VINTED: "bg-pink-100 text-pink-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  PARTIAL: "Partial",
  REFUNDED: "Refunded",
  FAILED: "Failed",
}

const VINTED_STATUS_FLOW = ["CONFIRMED", "PURCHASING_IN_JAPAN", "AVAILABLE_ON_VINTED"]

const VINTED_STATUS_OPTIONS = [
  { value: "PENDING", label: "pending" },
  { value: "CONFIRMED", label: "confirmed" },
  { value: "PURCHASING_IN_JAPAN", label: "purchasing in japan" },
  { value: "AVAILABLE_ON_VINTED", label: "available on vinted" },
  { value: "CANCELLED", label: "cancelled" },
  { value: "REFUNDED", label: "refunded" },
]

const REGULAR_STATUS_OPTIONS = [
  { value: "PENDING", label: "pending" },
  { value: "CONFIRMED", label: "confirmed" },
  { value: "PURCHASING_IN_JAPAN", label: "purchasing in japan" },
  { value: "AVAILABLE_ON_VINTED", label: "available on vinted" },
  { value: "SHIPPED", label: "shipped" },
  { value: "DELIVERED", label: "delivered" },
  { value: "CANCELLED", label: "cancelled" },
  { value: "REFUNDED", label: "refunded" },
]

const FILTER_STATUS_OPTIONS = [
  { value: "PENDING", label: "pending" },
  { value: "CONFIRMED", label: "confirmed" },
  { value: "PURCHASING_IN_JAPAN", label: "purchasing in japan" },
  { value: "AVAILABLE_ON_VINTED", label: "available on vinted" },
  { value: "SHIPPED", label: "shipped" },
  { value: "DELIVERED", label: "delivered" },
  { value: "CANCELLED", label: "cancelled" },
  { value: "REFUNDED", label: "refunded" },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [search, statusFilter, paymentFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (paymentFilter) params.set("paymentStatus", paymentFilter)
      params.set("limit", "50")
      const res = await fetch(`/api/admin/orders?${params}`, { credentials: "include" })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ status: newStatus }) })
      if (!res.ok) throw new Error("Failed")
      fetchOrders()
    } catch { alert("Error") } finally { setUpdating(null) }
  }

  const updateVintedStatus = async (orderId: string, currentStatus: string) => {
    const vintedFlow = ["CONFIRMED", "PURCHASING_IN_JAPAN", "AVAILABLE_ON_VINTED"]
    const currentIndex = vintedFlow.indexOf(currentStatus)
    const nextStatus = vintedFlow[currentIndex + 1]
    if (!nextStatus) return
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/vinted-status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ status: nextStatus }) })
      if (!res.ok) throw new Error("Failed")
      fetchOrders()
    } catch { alert("Error") } finally { setUpdating(null) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer orders</p>
        </div>
        <Button variant="outline" onClick={fetchOrders} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer, email, ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              <option value="">All Status</option>
              {FILTER_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="h-4 w-4" />
            Filters <ChevronDown className="h-4 w-4 transition-transform" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500">Loading...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Truck className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders</h3>
            <p className="text-gray-500 dark:text-gray-400">Orders appear here when customers buy</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4 hidden md:table-cell">Items</th>
                  <th className="p-4 text-right">Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Payment</th>
                  <th className="p-4 hidden lg:table-cell">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <a href={`/admin/orders/${order.id}`} className="font-mono text-sm text-blue-600 hover:underline">#{order.id.slice(0,8)}</a>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.email}</p>
                      {order.phone && <p className="text-xs text-gray-400">{order.phone}</p>}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0,3).map((item, i) => (
                          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {item.product.name} ×{item.quantity}
                          </span>
                        ))}
                        {order.items.length > 3 && <span className="text-xs text-gray-500">+{order.items.length - 3} more</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`px-2 py-1 rounded text-xs font-medium border ${order.isVintedOrder ? VINTED_ORDER_STATUS_COLORS[order.status] : ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {(order.isVintedOrder ? VINTED_STATUS_OPTIONS : REGULAR_STATUS_OPTIONS).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      {(() => {
                        const status = order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS
                        const label = PAYMENT_STATUS_LABELS[status] || order.paymentStatus
                        const colors: Record<string, string> = {
                          PAID: "bg-green-100 text-green-800",
                          FAILED: "bg-red-100 text-red-800",
                          UNPAID: "bg-yellow-100 text-yellow-800",
                          PARTIAL: "bg-blue-100 text-blue-800",
                          REFUNDED: "bg-purple-100 text-purple-800",
                        }
                        return (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
                            {label}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/admin/orders/${order.id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="View">
                          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </a>
                        {order.isVintedOrder && VINTED_STATUS_FLOW.includes(order.status) && (
                          <button
                            onClick={() => updateVintedStatus(order.id, order.status)}
                            disabled={updating === order.id}
                            className="flex items-center gap-1 px-3 py-1.5 border border-pink-300 dark:border-pink-600 rounded-lg text-sm font-medium text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            Next Step
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}