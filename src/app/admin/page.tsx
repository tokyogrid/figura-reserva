import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { formatPrice } from "@/lib/utils"
import { Package, ShoppingCart, MessageSquare, Clock, Banknote, ArrowRight } from "lucide-react"

async function getStats() {
  const [products, orders, pendingOrders, requests, pendingRequests, recentOrders, lowStock] = await Promise.all([
    prisma.product.count({ where: { status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PURCHASING"] } } }),
    prisma.figureRequest.count(),
    prisma.figureRequest.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: { include: { product: true } } } }),
    prisma.product.findMany({ where: { stock: { gt: 0, lte: 5 }, status: "AVAILABLE" }, take: 5, orderBy: { stock: "asc" } }),
  ])
  const revenue = await prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } })
  return { products, orders, pendingOrders, requests, pendingRequests, recentOrders, lowStock, revenue: revenue._sum.total || 0 }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your figure catalog</p>
        </div>
        <Link href="/admin/products/new"><Button variant="primary" className="gap-2"><Package className="h-4 w-4" /> New Product</Button></Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "Products", value: stats.products, icon: Package, color: "blue" },
          { label: "Orders", value: stats.orders, icon: ShoppingCart, color: "green" },
          { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "yellow" },
          { label: "Requests", value: stats.requests, icon: MessageSquare, color: "purple" },
          { label: "Pending Requests", value: stats.pendingRequests, icon: MessageSquare, color: "orange" },
          { label: "Revenue", value: formatPrice(stats.revenue), icon: Package, color: "emerald" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Low Stock ({stats.lowStock.length})</h3>
          {stats.lowStock.length === 0 ? <p className="text-gray-500 text-center py-4">No low stock products</p> : (
            <div className="space-y-3">
              {stats.lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Pending Requests ({stats.pendingRequests})</h3>
          {stats.pendingRequests === 0 ? <p className="text-gray-500 text-center py-4">No pending requests</p> : (
            <div className="space-y-3">
              {(await prisma.figureRequest.findMany({ where: { status: "PENDING" }, take: 5, orderBy: { createdAt: "desc" } })).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="font-medium">{r.character || r.series || "Unspecified"}</span>
                  <span className="text-sm text-gray-500">{r.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}