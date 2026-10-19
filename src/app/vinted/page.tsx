"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Star, Truck, Shield, Heart, MessageSquare, ExternalLink, Package, RefreshCw, Settings } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface VintedAccount {
  username: string
  rating: number
  totalSales: number
  positiveFeedback: number
  negativeFeedback: number
  neutralFeedback: number
  lastLogin: string
  isConnected: boolean
}

interface VintedReview {
  vintedReviewId: string
  buyerUsername: string
  rating: number
  comment: string | null
  orderId: string | null
  reviewDate: string
}

export default function VintedPage() {
  const [account, setAccount] = useState<VintedAccount | null>(null)
  const [reviews, setReviews] = useState<VintedReview[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview")

  useEffect(() => {
    fetchAccount()
    fetchReviews()
  }, [])

  const fetchAccount = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/vinted", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setAccount(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/vinted/reviews", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleRefresh = async () => {
    try {
      const res = await fetch("/api/admin/vinted/refresh", { 
        method: "POST", 
        credentials: "include" 
      })
      if (res.ok) {
        const data = await res.json()
        setAccount(data)
        fetchReviews()
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!account || !account.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full mb-4">
              <Settings className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium">Vinted Connection Required</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Vinted Account Not Connected
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              The Vinted account needs to be connected in the admin panel. 
              Once connected, this page will show real-time stats from Vinted.
            </p>
            <a 
              href="/admin/vinted" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
            >
              Go to Admin Vinted Settings
              <span className="h-4 w-4">→</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="container max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Vinted Integration</h1>
            <p className="text-gray-300">Real-time data from connected Vinted account</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading || refreshing} className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800/50 mb-8">
          {[
            { id: "overview", label: "Overview", icon: Star },
            { id: "reviews", label: "Comments", icon: MessageSquare },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "ghost"}
              className="gap-2"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && account && (
          <>
            {/* Ratings Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-400">Overall Rating</p>
                  <p className="text-3xl font-bold text-white">{account.rating.toFixed(1)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-400">{account.rating.toFixed(1)}/5.0</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-400">Total Sales</p>
                  <p className="text-3xl font-bold text-white">{account.totalSales}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-400">Positive</p>
                  <p className="text-3xl font-bold text-green-500">{account.positiveFeedback}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-400">Neutral</p>
                  <p className="text-3xl font-bold text-yellow-500">{account.neutralFeedback}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800/50">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-400">Negative</p>
                  <p className="text-3xl font-bold text-red-500">{account.negativeFeedback}</p>
                </CardContent>
              </Card>
            </div>

            {/* Vinted Profile Button */}
            <div className="mb-8 text-center">
              <a 
                href="https://www.vinted.es/member/165795784"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" className="gap-2" size="lg">
                  <ExternalLink className="h-4 w-4" />
                  View Vinted Profile
                </Button>
              </a>
            </div>
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
                  <p className="text-gray-400">Click "Refresh Data" to sync reviews from Vinted</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.vintedReviewId} className="p-4 border border-gray-800/50 rounded-lg bg-gray-900/30">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">{review.buyerUsername}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-600"}`} />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-300">{review.comment}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Order: {review.orderId || "N/A"} • {new Date(review.reviewDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}