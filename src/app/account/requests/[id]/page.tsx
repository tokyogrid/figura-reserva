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
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONTACTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PRODUCT_CREATED: "bg-green-500/10 text-green-400 border-green-500/20",
  REJECTED: "bg-gray-800/50 text-gray-400 border-gray-700",
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
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!request) return null

  const images: string[] = JSON.parse(request.images || "[]")
  const StatusIcon = STATUS_ICONS[request.status] || Clock

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 bg-white/5 hover:bg-white/10 text-white border-white/10">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Request #{request.id.slice(0, 8)}</h1>
              <p className="text-gray-400">Submitted {new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge className={REQUEST_STATUS_COLORS[request.status] || "bg-gray-800/50 text-gray-400 border-gray-700"} variant="outline">
            <StatusIcon className="h-3 w-3 mr-1" />
            {REQUEST_STATUS_LABELS[request.status] || request.status}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Figure Info */}
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Figure Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Figure Name</p>
                  <p className="font-medium text-white">{request.figureName || request.character || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Series / Anime</p>
                  <p className="font-medium text-white">{request.series || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Manufacturer</p>
                  <p className="font-medium text-white">{request.manufacturer || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Scale</p>
                  <p className="font-medium text-white">{request.scale || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Budget</p>
                  <p className="font-medium text-white">{formatBudget(request.budgetMin, request.budgetMax)}</p>
                </div>
              </div>

              {request.notes && (
                <div>
                  <p className="text-sm text-gray-400">Notes</p>
                  <p className="text-white whitespace-pre-wrap">{request.notes}</p>
                </div>
              )}

              {images.length > 0 && images.some(img => img && img.trim() !== "") && (
                <div>
                  <p className="text-sm text-gray-400">Reference Images</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {images.map((img: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg border-2 border-dashed border-gray-700 overflow-hidden relative bg-gray-800">
                          {img && img.trim() !== "" ? (
                            <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
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
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Your Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-medium text-white">{request.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium text-white">{request.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "PENDING", label: "Request Submitted", date: request.createdAt },
                  { key: "CONTACTED", label: "Supplier Contacted", date: request.status === "CONTACTED" || request.status === "PRODUCT_CREATED" || request.status === "REJECTED" ? request.createdAt : null },
                  { key: "PRODUCT_CREATED", label: "Product Found & Listed", date: request.status === "PRODUCT_CREATED" ? request.createdAt : null },
                  { key: "REJECTED", label: "Request Declined", date: request.status === "REJECTED" ? request.createdAt : null },
                ].map((step, idx) => (
                  <div key={step.key} className={cn("flex items-start gap-4", idx < 3 && "pb-4 border-l-2 border-gray-800/50 pl-4")}>
                    <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", request.status === step.key || (step.key === "CONTACTED" && (request.status === "PRODUCT_CREATED" || request.status === "REJECTED")) || (step.key === "PENDING") ? "bg-purple-600" : "bg-gray-800")}>
                      {request.status === step.key || (step.key === "CONTACTED" && (request.status === "PRODUCT_CREATED" || request.status === "REJECTED")) || (step.key === "PENDING") ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <StatusIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-medium", request.status === step.key ? "text-white" : "text-gray-400")}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-400">
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
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-400">Figure Found!</p>
                    <p className="text-sm text-green-300">We found the figure and created a product listing.</p>
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