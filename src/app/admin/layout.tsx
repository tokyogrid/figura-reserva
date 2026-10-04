import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Store, TicketPercent } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
              <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </span>
              Tokyo Grid Admin
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
              <Link href="/admin/products" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Products</Link>
              <Link href="/admin/orders" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Orders</Link>
              <Link href="/admin/requests" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Requests</Link>
              <Link href="/admin/vinted" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Vinted</Link>
              <Link href="/admin/discounts" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Discounts</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">View Site</Link>
            <form action="/api/admin/logout" method="POST"><button className="text-sm text-gray-600 hover:text-gray-900">Logout</button></form>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  )
}