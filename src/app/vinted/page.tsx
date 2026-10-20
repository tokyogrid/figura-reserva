"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Star, Truck, Shield, Heart, ExternalLink, Package, RefreshCw, Settings } from "lucide-react"
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
  fiveStarReviews?: number
  fourStarReviews?: number
  threeStarReviews?: number
  twoStarReviews?: number
  oneStarReviews?: number
  totalReviews?: number
}

export default function VintedPage() {
  const [account, setAccount] = useState<VintedAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAccount()
  }, [])

  const fetchAccount = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/vinted/account", { credentials: "include" })
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

  const handleRefresh = async () => {
    try {
      const res = await fetch("/api/admin/vinted/refresh", { 
        method: "POST", 
        credentials: "include" 
      })
      if (res.ok) {
        const data = await res.json()
        setAccount(data)
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

  // Calculate star breakdown - using hardcoded values per user request
  const fiveStar = 36
  const fourStar = 1
  const threeStar = 0
  const twoStar = 0
  const oneStar = 2
  const totalReviews = fiveStar + fourStar + threeStar + twoStar + oneStar
  const averageRating = ((fiveStar * 5) + (fourStar * 4) + (threeStar * 3) + (twoStar * 2) + (oneStar * 1)) / totalReviews

  const starBreakdown = [
    { stars: 5, count: fiveStar, label: "5 stars" },
    { stars: 4, count: fourStar, label: "4 stars" },
    { stars: 3, count: threeStar, label: "3 stars" },
    { stars: 2, count: twoStar, label: "2 stars" },
    { stars: 1, count: oneStar, label: "1 star" },
  ]

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

        {/* Ratings Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800/50 lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Overall Rating</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{averageRating.toFixed(1)}/5.0</span>
                  </div>
                </div>
                <div className="flex flex-col items-end sm:items-end">
                  <p className="text-sm text-gray-400">{totalReviews} total reviews</p>
                  <p className="text-lg font-medium text-white">{totalReviews} total reviews</p>
                </div>
              </div>
              {/* Star breakdown bars */}
              <div className="mt-6 space-y-2">
                {starBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-400 w-20">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-16 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">Total Reviews</p>
              <p className="text-3xl font-bold text-white">{totalReviews}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">Positive (4-5★)</p>
              <p className="text-3xl font-bold text-green-500">{fiveStar + fourStar}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">Neutral (3★)</p>
              <p className="text-3xl font-bold text-yellow-500">{threeStar}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800/50">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">Negative (1-2★)</p>
              <p className="text-3xl font-bold text-red-500">{oneStar + twoStar}</p>
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
      </div>
    </div>
  )
}