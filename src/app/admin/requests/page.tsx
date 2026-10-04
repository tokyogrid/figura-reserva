"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Search, Filter, ChevronDown, MessageSquare, RefreshCw, Eye, Mail } from "lucide-react"
import { cn, REQUEST_STATUS_LABELS } from "@/lib/utils"
import { useToast } from "@/components/ui/Toaster"

interface Request { 
  id: string; 
  name: string; 
  email: string; 
  series: string | null; 
  character: string | null; 
  manufacturer: string | null; 
  scale: string | null; 
  budgetMin: number | null; 
  budgetMax: number | null; 
  notes: string | null; 
  status: string; 
  createdAt: string; 
  productId: string | null 
}

export default function AdminRequestsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { fetchRequests() }, [search, statusFilter])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      params.set("limit", "50")
      const res = await fetch(`/api/admin/requests?${params}`, { credentials: "include" })
      const data = await res.json()
      setRequests(data.requests || [])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const updateStatus = async (requestId: string, newStatus: string) => {
    setUpdating(requestId)
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ status: newStatus }) })
      if (!res.ok) throw new Error("Error")
      fetchRequests(); toast({ type: "success", title: "Updated" })
    } catch { toast({ type: "error", title: "Error" }) } finally { setUpdating(null) }
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified"
    if (min && max) return `€${(min / 100).toFixed(0)} - €${(max / 100).toFixed(0)}`
    if (min) return `From €${(min / 100).toFixed(0)}`
    if (max) return `Up to €${(max / 100).toFixed(0)}`
    return "Not specified"
  }

  const statusOptions = [{ value: "PENDING", label: "Pending" }, { value: "CONTACTED", label: "Contacted" }, { value: "PRODUCT_CREATED", label: "Product Created" }, { value: "REJECTED", label: "Rejected" }]
 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Figure Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer requests</p>
        </div>
        <Button variant="outline" onClick={fetchRequests} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search name, email, character, series..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              <option value="">All</option>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="md:hidden">
            <Button variant="outline" className="w-full gap-2" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filters <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500">Loading...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No requests</h3>
            <p className="text-gray-500 dark:text-gray-400">Customer requests appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <th className="p-4">Request</th>
                  <th className="p-4">Client</th>
                  <th className="p-4 hidden md:table-cell">Figure</th>
                  <th className="p-4 hidden lg:table-cell">Budget</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 hidden lg:table-cell">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4"><Link href={`/admin/requests/${request.id}`} className="font-mono text-sm text-blue-600 hover:underline">#{request.id.slice(0,8)}</Link></td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white">{request.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{request.email}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="font-medium text-gray-900 dark:text-white">{request.character || request.series || "Not specified"}</p>
                      {request.series && request.character && <p className="text-xs text-gray-500">{request.series}</p>}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                      {request.budgetMin || request.budgetMax ? `€${(request.budgetMin || 0)/100} - €${(request.budgetMax || 0)/100}` : "Not specified"}
                    </td>
                    <td className="p-4 text-center">
                      <select value={request.status} onChange={e => updateStatus(request.id, e.target.value)} disabled={updating === request.id} className={`px-2 py-1 rounded text-xs font-medium border ${request.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : request.status === "CONTACTED" ? "bg-blue-100 text-blue-800" : request.status === "PRODUCT_CREATED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-gray-500 dark:text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/requests/${request.id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" title="View"><Eye className="h-4 w-4 text-gray-500" /></Link>
                        <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${request.email}`)} className="gap-1"><Mail className="h-3.5 w-3.5" /> Email</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}