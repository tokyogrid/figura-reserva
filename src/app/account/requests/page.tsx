"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toaster"
import { MessageSquare, ArrowLeft, Search, Filter, ChevronDown, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

interface Request {
  id: string
  name: string
  email: string
  figureName: string | null
  character: string | null
  series: string | null
  manufacturer: string | null
  scale: string | null
  budgetMin: number | null
  budgetMax: number | null
  notes: string | null
  images: string
  status: string
  createdAt: string
  productId: string | null
}

const REQUEST_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  PRODUCT_CREATED: "Product Created",
  REJECTED: "Rejected",
}

const REQUEST_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONTACTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PRODUCT_CREATED: "bg-green-500/10 text-green-400 border-green-500/20",
  REJECTED: "bg-gray-800/50 text-gray-400 border-gray-700",
}

export default function AccountRequestsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      const res = await fetch(`/api/account/requests?${params}`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setRequests(data.requests || [])
      }
    } catch (e) {
      console.error(e)
      toast({ type: "error", title: "Error", message: "Failed to load requests" })
    } finally {
      setLoading(false)
    }
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified"
    if (min && max) return `€${(min / 100).toFixed(0)} - €${(max / 100).toFixed(0)}`
    if (min) return `From €${(min / 100).toFixed(0)}`
    if (max) return `Up to €${(max / 100).toFixed(0)}`
    return "Not specified"
  }

  const statusOptions = [
    { value: "", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "PRODUCT_CREATED", label: "Product Created" },
    { value: "REJECTED", label: "Rejected" },
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
              <h1 className="text-3xl font-bold text-white">My Requests</h1>
              <p className="text-gray-400">Track your figure requests</p>
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
                  placeholder="Search figure name, series..."
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
            {requests.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No requests yet</h3>
                <p className="text-gray-400 mb-6">When you request a figure, it will appear here.</p>
                <Link href="/request">
                  <Button variant="primary" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Request a Figure
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800/50 bg-gray-900/30 text-left text-sm font-medium text-gray-400">
                      <th className="p-4">Request</th>
                      <th className="p-4">Figure</th>
                      <th className="p-4 hidden md:table-cell">Series</th>
                      <th className="p-4 hidden lg:table-cell">Budget</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {requests.map(request => (
                      <tr key={request.id} className="hover:bg-white/5">
                        <td className="p-4">
                          <Link href={`/account/requests/${request.id}`} className="font-mono text-sm text-purple-400 hover:underline">
                            #{request.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-white">{request.figureName || request.character || "Not specified"}</p>
                          {request.images && (() => {
                            try {
                              const imgs = JSON.parse(request.images)
                              return imgs.length > 0 && imgs.some((img: string) => img && img.trim() !== "") && (
                                <div className="flex gap-1 mt-1">
                                  {imgs.filter((img: string) => img && img.trim() !== "").slice(0, 3).map((img: string, idx: number) => (
                                    <img key={idx} src={img} alt="" className="h-8 w-8 rounded object-cover border border-gray-700" />
                                  ))}
                                </div>
                              )
                            } catch {
                              return null
                            }
                          })()}
                        </td>
                        <td className="p-4 hidden md:table-cell text-gray-400">
                          {request.series || "-"}
                        </td>
                        <td className="p-4 hidden lg:table-cell text-gray-400">
                          {formatBudget(request.budgetMin, request.budgetMax)}
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={REQUEST_STATUS_COLORS[request.status] || "bg-gray-800/50 text-gray-400 border-gray-700"}>
                            {REQUEST_STATUS_LABELS[request.status] || request.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Link href={`/account/requests/${request.id}`} className="text-sm font-medium text-purple-400 hover:underline">
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