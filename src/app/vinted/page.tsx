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
      </div>
    </div>
  )
}