"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Settings, Star, RefreshCw, Shield, Package, MessageSquare, Eye, Store, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"

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

interface VintedOrder {
  vintedOrderId: string
  buyerUsername: string
  itemTitle: string
  itemPrice: number
  status: string
  orderDate: string
  shippedDate: string | null
  deliveredDate: string | null
  trackingNumber: string | null
  trackingUrl: string | null
}

interface VintedReview {
  vintedReviewId: string
  buyerUsername: string
  rating: number
  comment: string | null
  orderId: string | null
  reviewDate: string
}

interface VintedListing {
  vintedListingId: string
  title: string
  description: string | null
  price: number
  status: string
  size: string | null
  brand: string | null
  category: string | null
  images: string
  listingUrl: string
}

export default function VintedPage() {
  const [account, setAccount] = useState<VintedAccount | null>(null)
  const [orders, setOrders] = useState<VintedOrder[]>([])
  const [reviews, setReviews] = useState<VintedReview[]>([])
  const [listings, setListings] = useState<VintedListing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "reviews" | "listings">("overview")
  const [formData, setFormData] = useState({
    username: "",
  })

  useEffect(() => {
    fetchAccount()
    fetchOrders()
    fetchReviews()
    fetchListings()
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

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/vinted/orders", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch (e) {
      console.error(e)
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

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/admin/vinted/listings", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/vinted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: formData.username }),
      })
      if (res.ok) {
        const data = await res.json()
        setAccount(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch("/api/admin/vinted/refresh", { 
        method: "POST", 
        credentials: "include" 
      })
      if (res.ok) {
        const data = await res.json()
        setAccount(data)
        fetchOrders()
        fetchReviews()
        fetchListings()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vinted Integration</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your Vinted connection and sync data</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={loading || refreshing} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh Data
        </Button>
      </div>

      {/* Connection Form */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Vinted Connection
          </CardTitle>
          {account?.isConnected && (
            <Badge variant="success" className="gap-1">
              <Shield className="h-3 w-3" />
              Connected
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(e) }} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Vinted Username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                placeholder="your_vinted_username"
                disabled={account?.isConnected}
              />
            </div>
            <Button type="submit" disabled={saving} loading={saving} className="w-full sm:w-auto" variant="primary">
              {account?.isConnected ? "Update Username" : "Connect Vinted"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {account && (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "orders", label: "Orders", icon: Package },
              { id: "reviews", label: "Reviews", icon: MessageSquare },
              { id: "listings", label: "Listings", icon: Store },
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
          {activeTab === "overview" && (
            <>
              {/* Ratings Overview */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Overall Rating</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{account.rating.toFixed(1)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-500">{account.rating.toFixed(1)}/5.0</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{account.totalSales}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Positive</p>
                    <p className="text-3xl font-bold text-green-600">{account.positiveFeedback}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Neutral</p>
                    <p className="text-3xl font-bold text-yellow-600">{account.neutralFeedback}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Negative</p>
                    <p className="text-3xl font-bold text-red-600">{account.negativeFeedback}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{account.username}</p>
                        <a 
                          href="https://www.vinted.es/member/165795784"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Sync</p>
                      <p className="font-medium text-gray-900 dark:text-white">{account.lastLogin || "Never"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                      <p className="font-medium text-gray-900 dark:text-white">{account.totalSales}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <Badge variant={account.isConnected ? "success" : "danger"}>
                        {account.isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Feedback Breakdown</h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-sm text-green-700 dark:text-green-400">Positive</p>
                        <p className="text-2xl font-bold text-green-700">{account.positiveFeedback}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">Neutral</p>
                        <p className="text-2xl font-bold text-yellow-700">{account.neutralFeedback}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <p className="text-sm text-red-700 dark:text-red-400">Negative</p>
                        <p className="text-2xl font-bold text-red-700">{account.negativeFeedback}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Vinted Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders synced</h3>
                    <p className="text-gray-500 dark:text-gray-400">Click "Refresh Data" to sync orders from Vinted</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Buyer</th>
                          <th className="p-4">Item</th>
                          <th className="p-4 text-right">Price</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4">Order Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map(order => (
                          <tr key={order.vintedOrderId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="p-4 font-mono text-sm">{order.vintedOrderId}</td>
                            <td className="p-4">{order.buyerUsername}</td>
                            <td className="p-4">{order.itemTitle}</td>
                            <td className="p-4 text-right font-medium">{formatPrice(order.itemPrice)}</td>
                            <td className="p-4 text-center">
                              <Badge variant={order.status === "delivered" ? "success" : order.status === "shipped" ? "info" : order.status === "cancelled" ? "danger" : "default"}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              {order.trackingNumber && order.trackingUrl && (
                                <Button variant="outline" size="sm" onClick={() => window.open(order.trackingUrl!)} className="gap-1">
                                  <Eye className="h-3 w-3" />
                                  Track
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reviews synced</h3>
                    <p className="text-gray-500 dark:text-gray-400">Click "Refresh Data" to sync reviews from Vinted</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.vintedReviewId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">{review.buyerUsername}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300 dark:text-gray-600"}`} />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <div className="p-8 text-center">
                    <Store className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No listings synced</h3>
                    <p className="text-gray-500 dark:text-gray-400">Click "Refresh Data" to sync listings from Vinted</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map(listing => {
                      const images = JSON.parse(listing.images || "[]")
                      return (
                        <div key={listing.vintedListingId} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                            {images[0] ? (
                              <img src={images[0]} alt={listing.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-12 w-12" />
                              </div>
                            )}
                            <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                              listing.status === "active" ? "bg-green-100 text-green-800" :
                              listing.status === "sold" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {listing.status}
                            </span>
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">{listing.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{listing.brand} • {listing.category}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{formatPrice(listing.price)}</p>
                            <a href={listing.listingUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
                              View on Vinted
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}