"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toaster"
import { Package, ArrowLeft, Search, Filter, ChevronDown, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, VINTED_ORDER_STATUS_LABELS, VINTED_ORDER_STATUS_COLORS } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

interface Order {
  id: string
  customerName: string
  email: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  isVintedOrder: boolean
  items: Array<{
    quantity: number
    price: number
    product: {
      name: string
      images: string
      slug: string
    }
  }>
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      const res = await fetch(`/api/account/orders?${params}`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (e) {
      console.error(e)
      toast({ type: "error", title: "Error", message: "Failed to load orders" })
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PURCHASING_IN_JAPAN", label: "Purchasing in Japan" },
    { value: "AVAILABLE_ON_VINTED", label: "Available on Vinted" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/10">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Orders</h1>
              <p className="text-gray-400">Track and manage your purchases</p>
            </div>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search order #, product name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white"
              >
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                <p className="text-gray-400 mb-6">When you place an order, it will appear here.</p>
                <Link href="/catalog">
                  <Button variant="primary" className="gap-2">
                    <Package className="h-4 w-4" />
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/50 bg-gray-900/30 text-left text-sm font-medium text-gray-400">
                      <th className="p-4">Order</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-white/5">
                        <td className="p-4">
                          <Link href={`/order/${order.id}`} className="font-mono text-sm text-purple-400 hover:underline">
                            #{order.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                                {JSON.parse(item.product.images)[0] ? (
                                  <img src={JSON.parse(item.product.images)[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="h-5 w-5 mx-auto my-auto text-gray-500" />
                                )}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <span className="text-sm text-gray-400">+{order.items.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-white">
                          {formatPrice(order.total)}
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={order.isVintedOrder ? (VINTED_ORDER_STATUS_COLORS[order.status] || "bg-gray-800/50 text-gray-300 border-gray-700") : (ORDER_STATUS_COLORS[order.status] || "bg-gray-800/50 text-gray-300 border-gray-700")}>
                            <span className="flex items-center justify-center gap-1.5">
                              {(!order.isVintedOrder && order.status === "DELIVERED") && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-current" aria-hidden="true" />
                              )}
                              {order.isVintedOrder ? (VINTED_ORDER_STATUS_LABELS[order.status] || order.status) : (ORDER_STATUS_LABELS[order.status] || order.status)}
                            </span>
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/order/${order.id}`} className="text-sm font-medium text-purple-400 hover:underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}