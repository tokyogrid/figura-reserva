"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toaster"
import { ArrowLeft, MessageSquare, Clock, CheckCircle, XCircle, Image as ImageIcon, MapPin, Factory, Scale, Banknote } from "lucide-react"
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
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONTACTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PRODUCT_CREATED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING: Clock,
  CONTACTED: MessageSquare,
  PRODUCT_CREATED: CheckCircle,
  REJECTED: XCircle,
}

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequest()
  }, [params.id])

  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/account/requests/${params.id}`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setRequest(data.request)
      } else if (res.status === 404) {
        toast({ type: "error", title: "Not found", message: "Request not found" })
        router.push("/account/requests")
      } else {
        toast({ type: "error", title: "Error", message: "Failed to load request" })
        router.push("/account/requests")
      }
    } catch (e) {
      console.error(e)
      toast({ type: "error", title: "Error", message: "Failed to load request" })
      router.push("/account/requests")
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!request) return null

  const images: string[] = JSON.parse(request.images || "[]")
  const StatusIcon = STATUS_ICONS[request.status] || Clock

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-8">
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
          <Badge className={REQUEST_STATUS_COLORS[request.status] || "bg-gray-100 text-gray-800"} variant="outline">
            <StatusIcon className="h-3 w-3 mr-1" />
            {REQUEST_STATUS_LABELS[request.status] || request.status}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Figure Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                <CardTitle>Figure Details</CardTitle>
              </div>
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
                <div>
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
                            <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                              <ImageIcon className="h-8 w-8 mb-2" />
                              <span className="text-xs">No image</span>
                            </div>
                          )}
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
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <CardTitle>Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{request.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "PENDING", label: "Request Submitted", date: request.createdAt },
                  { key: "CONTACTED", label: "Supplier Contacted", date: request.status === "CONTACTED" || request.status === "PRODUCT_CREATED" || request.status === "REJECTED" ? request.createdAt : null },
                  { key: "PRODUCT_CREATED", label: "Product Found & Listed", date: request.status === "PRODUCT_CREATED" ? request.createdAt : null },
                  { key: "REJECTED", label: "Request Declined", date: request.status === "REJECTED" ? request.createdAt : null },
                ].map((step, idx) => (
                  <div key={step.key} className={cn("flex items-start gap-4", idx < 3 && "pb-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4")}>
                    <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", request.status === step.key || (step.key === "CONTACTED" && (request.status === "PRODUCT_CREATED" || request.status === "REJECTED")) || (step.key === "PENDING") ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700")}>
                      {request.status === step.key || (step.key === "CONTACTED" && (request.status === "PRODUCT_CREATED" || request.status === "REJECTED")) || (step.key === "PENDING") ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <StatusIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-medium", request.status === step.key ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(step.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action if product created */}
          {request.status === "PRODUCT_CREATED" && request.productId && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">Figure Found!</p>
                    <p className="text-sm text-green-700 dark:text-green-400">We found the figure and created a product listing.</p>
                  </div>
                </div>
                <Link href={`/catalog/${request.productId}`}>
                  <Button variant="primary" className="gap-2">
                    View Product
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}