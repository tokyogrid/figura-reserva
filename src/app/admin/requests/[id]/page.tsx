"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toaster"
import { ArrowLeft, MessageSquare, Mail, Package, Calendar, Factory, Scale, Banknote, Image as ImageIcon, Plus, Trash2, Save, XCircle, CheckCircle, Copy } from "lucide-react"
import Link from "next/link"
import { formatPrice, cn } from "@/lib/utils"
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from "@/lib/utils"

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

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "PRODUCT_CREATED", label: "Product Created" },
  { value: "REJECTED", label: "Rejected" },
]

const formatBudget = (min: number | null, max: number | null) => {
  if (!min && !max) return "Not specified"
  if (min && max) return `€${(min / 100).toFixed(0)} - €${(max / 100).toFixed(0)}`
  if (min) return `From €${(min / 100).toFixed(0)}`
  if (max) return `Up to €${(max / 100).toFixed(0)}`
  return "Not specified"
}

export default function AdminRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRequest()
  }, [params.id])

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/admin/requests/${params.id}`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setRequest(data.request)
      } else if (res.status === 404) {
        toast({ type: "error", title: "Not found", message: "Request not found" })
        router.push("/admin/requests")
      } else {
        toast({ type: "error", title: "Error", message: "Failed to load request" })
        router.push("/admin/requests")
      }
    } catch (e) {
      console.error(e)
      toast({ type: "error", title: "Error", message: "Failed to load request" })
      router.push("/admin/requests")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/requests/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Error updating status")
      toast({ type: "success", title: "Status updated" })
      setRequest({ ...request, status: newStatus })
    } catch (e) {
      toast({ type: "error", title: "Error", message: "Failed to update status" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!request) return null

  const images: string[] = JSON.parse(request.images || "[]")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request #{request.id.slice(0, 8)}</h1>
            <p className="text-gray-600 dark:text-gray-400">Submitted {new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <Badge className={REQUEST_STATUS_COLORS[request.status] || "bg-gray-100 text-gray-800"}>
          {REQUEST_STATUS_LABELS[request.status] || request.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Figure Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                Figure Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Figure Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.figureName || request.character || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Series / Anime</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.series || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manufacturer</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.manufacturer || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Scale</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.scale || "Not specified"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatBudget(request.budgetMin, request.budgetMax)}</p>
                </div>
              </div>

              {request.notes && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{request.notes}</p>
                </div>
              )}

              {images.length > 0 && images.some(img => img && img.trim() !== "") && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reference Images</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {images.map((img: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden relative bg-gray-50 dark:bg-gray-800">
                          {img && img.trim() !== "" ? (
                            <img 
                              src={img} 
                              alt={`Reference ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`Failed to load image ${idx}:`, img?.substring(0, 50))
                                e.currentTarget.style.display = 'none'
                                const nextEl = e.currentTarget.nextElementSibling as HTMLElement | null
                                if (nextEl) nextEl.style.display = 'flex'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                              <ImageIcon className="h-8 w-8 mb-2" />
                              <span className="text-xs">No image</span>
                            </div>
                          )}
                          <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 bg-gray-50 dark:bg-gray-800">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="text-xs">Failed to load</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white flex-1">{request.email}</p>
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(request.email); toast({ type: "success", title: "Email copied" }); }} className="gap-1">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Current Status:</span>
                <select
                  value={request.status}
                  onChange={e => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className={`px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${REQUEST_STATUS_COLORS[request.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {saving && <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />}
              </div>
            </CardContent>
          </Card>

          {/* Create Product Link */}
          {request.status === "PRODUCT_CREATED" && request.productId && (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">Product Created</p>
                      <p className="text-sm text-green-700 dark:text-green-400">This request has been converted to a product listing.</p>
                    </div>
                  </div>
                  <Link href={`/catalog/${request.productId}`}>
                    <Button variant="primary" className="gap-2">
                      View Product
                      <Package className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { navigator.clipboard.writeText(request.email); toast({ type: "success", title: "Email copied" }); }}>
                <Mail className="h-4 w-4" />
                Copy Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { navigator.clipboard.writeText(request.id); toast({ type: "success", title: "ID copied" }); }}>
                <Package className="h-4 w-4" />
                Copy Request ID
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { navigator.clipboard.writeText(request.images); toast({ type: "success", title: "Images JSON copied" }); }}>
                <ImageIcon className="h-4 w-4" />
                Copy Images JSON
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Request Submitted</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {(request.status === "CONTACTED" || request.status === "PRODUCT_CREATED" || request.status === "REJECTED") && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Supplier Contacted</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Team reached out to Japanese suppliers</p>
                    </div>
                  </div>
                )}
                {request.status === "PRODUCT_CREATED" && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Product Created & Listed</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Figure found and added to catalog</p>
                    </div>
                  </div>
                )}
                {request.status === "REJECTED" && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Request Declined</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Unable to source the requested figure</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}