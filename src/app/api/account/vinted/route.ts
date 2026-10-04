import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.vintedAccount.findUnique({
      where: { userId: session.userId },
    })

    if (!account) {
      return NextResponse.json({ 
        isConnected: false,
        username: "",
        rating: 0,
        totalSales: 0,
        positiveFeedback: 0,
        negativeFeedback: 0,
        neutralFeedback: 0,
        lastLogin: null,
      })
    }

    // Return account data without password
    return NextResponse.json({
      isConnected: account.isConnected,
      username: account.username,
      rating: account.rating,
      totalSales: account.totalSales,
      positiveFeedback: account.positiveFeedback,
      negativeFeedback: account.negativeFeedback,
      neutralFeedback: account.neutralFeedback,
      lastLogin: account.lastSync?.toISOString() || null,
    })
  } catch (error) {
    console.error("Get Vinted account error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    // Upsert Vinted account (no password required - just links to Vinted profile)
    const account = await prisma.vintedAccount.upsert({
      where: { userId: session.userId },
      update: {
        username,
        isConnected: true,
      },
      create: {
        userId: session.userId,
        username,
        isConnected: true,
      },
    })

    // Trigger initial sync in background
    syncVintedData(account.id).catch(console.error)

    return NextResponse.json({
      isConnected: true,
      username: account.username,
      rating: account.rating,
      totalSales: account.totalSales,
      positiveFeedback: account.positiveFeedback,
      negativeFeedback: account.negativeFeedback,
      neutralFeedback: account.neutralFeedback,
      lastLogin: account.lastSync?.toISOString() || null,
    })
  } catch (error) {
    console.error("Save Vinted account error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// Background sync function
async function syncVintedData(vintedAccountId: string) {
  try {
    const account = await prisma.vintedAccount.findUnique({
      where: { id: vintedAccountId },
    })

    if (!account || !account.isConnected) return
    
    // TODO: Implement actual Vinted API integration
    // For now, we'll simulate the sync with mock data
    // In production, you would use a Vinted API client or web scraping
    
    const mockData = await fetchVintedData(account.username)
    
    await prisma.$transaction(async (tx) => {
      // Update account stats
      await tx.vintedAccount.update({
        where: { id: vintedAccountId },
        data: {
          rating: mockData.rating,
          totalSales: mockData.totalSales,
          positiveFeedback: mockData.positiveFeedback,
          negativeFeedback: mockData.negativeFeedback,
          neutralFeedback: mockData.neutralFeedback,
          lastSync: new Date(),
        },
      })

      // Sync orders
      for (const order of mockData.orders) {
        await tx.vintedOrder.upsert({
          where: { vintedOrderId: order.id },
          update: {
            status: order.status,
            shippedDate: order.shippedDate ? new Date(order.shippedDate) : null,
            deliveredDate: order.deliveredDate ? new Date(order.deliveredDate) : null,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
          },
          create: {
            vintedAccountId,
            vintedOrderId: order.id,
            buyerUsername: order.buyerUsername,
            itemTitle: order.itemTitle,
            itemPrice: order.itemPrice,
            status: order.status,
            orderDate: new Date(order.orderDate),
            shippedDate: order.shippedDate ? new Date(order.shippedDate) : null,
            deliveredDate: order.deliveredDate ? new Date(order.deliveredDate) : null,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
          },
        })
      }

      // Sync reviews
      for (const review of mockData.reviews) {
        await tx.vintedReview.upsert({
          where: { vintedReviewId: review.id },
          update: {
            rating: review.rating,
            comment: review.comment,
          },
          create: {
            vintedAccountId,
            vintedReviewId: review.id,
            buyerUsername: review.buyerUsername,
            rating: review.rating,
            comment: review.comment,
            orderId: review.orderId,
            reviewDate: new Date(review.reviewDate),
          },
        })
      }

      // Sync listings
      for (const listing of mockData.listings) {
        await tx.vintedListing.upsert({
          where: { vintedListingId: listing.id },
          update: {
            title: listing.title,
            description: listing.description,
            price: listing.price,
            status: listing.status,
            size: listing.size,
            brand: listing.brand,
            category: listing.category,
            images: JSON.stringify(listing.images),
            listingUrl: listing.listingUrl,
          },
          create: {
            vintedAccountId,
            vintedListingId: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            status: listing.status,
            size: listing.size,
            brand: listing.brand,
            category: listing.category,
            images: JSON.stringify(listing.images),
            listingUrl: listing.listingUrl,
          },
        })
      }
    })
  } catch (error) {
    console.error("Vinted sync error:", error)
  }
}

// Mock function - replace with actual Vinted API integration
async function fetchVintedData(username: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return mock data
  return {
    rating: 4.8,
    totalSales: 127,
    positiveFeedback: 115,
    negativeFeedback: 2,
    neutralFeedback: 10,
    orders: [
      {
        id: "VNT-001",
        buyerUsername: "anime_lover_23",
        itemTitle: "Anya Forger Figure - Spy x Family",
        itemPrice: 8999,
        status: "delivered",
        orderDate: "2024-01-15",
        shippedDate: "2024-01-16",
        deliveredDate: "2024-01-20",
        trackingNumber: "TRK123456",
        trackingUrl: "https://tracking.example.com/TRK123456",
      },
      {
        id: "VNT-002",
        buyerUsername: "figure_collector",
        itemTitle: "Goku Super Saiyan - Dragon Ball Z",
        itemPrice: 12999,
        status: "shipped",
        orderDate: "2024-01-20",
        shippedDate: "2024-01-21",
        deliveredDate: null,
        trackingNumber: "TRK789012",
        trackingUrl: "https://tracking.example.com/TRK789012",
      },
    ],
    reviews: [
      {
        id: "REV-001",
        buyerUsername: "anime_lover_23",
        rating: 5,
        comment: "Perfect condition, fast shipping!",
        orderId: "VNT-001",
        reviewDate: "2024-01-22",
      },
      {
        id: "REV-002",
        buyerUsername: "figure_collector",
        rating: 4,
        comment: "Good figure, packaging could be better",
        orderId: "VNT-002",
        reviewDate: "2024-01-25",
      },
    ],
    listings: [
      {
        id: "LST-001",
        title: "Anya Forger Figure - Spy x Family",
        description: "Brand new, sealed in box",
        price: 8999,
        status: "sold",
        size: "1/7",
        brand: "Good Smile Company",
        category: "Figures",
        images: ["https://example.com/anf1.jpg", "https://example.com/anf2.jpg"],
        listingUrl: "https://vinted.com/items/123456",
      },
      {
        id: "LST-002",
        title: "Goku Super Saiyan - Dragon Ball Z",
        description: "Excellent condition, display only",
        price: 12999,
        status: "active",
        size: "1/8",
        brand: "Bandai",
        category: "Figures",
        images: ["https://example.com/goku1.jpg"],
        listingUrl: "https://vinted.com/items/789012",
      },
    ],
  }
}