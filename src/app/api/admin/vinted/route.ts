import { NextRequest, NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.vintedAccount.findFirst({
      include: {
        user: { select: { email: true, name: true } },
      },
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
    console.error("Admin get Vinted account error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 })
    }

    // Find or create admin user for Vinted connection
    let adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
    })

    if (!adminUser) {
      // Create a system admin user for Vinted
      adminUser = await prisma.user.create({
        data: {
          email: "vinted@system.local",
          passwordHash: "system",
          name: "Vinted System",
          role: "admin",
        },
      })
    }

    // Upsert Vinted account (just store username, no password needed)
    const account = await prisma.vintedAccount.upsert({
      where: { userId: adminUser.id },
      update: {
        username,
        isConnected: true,
      },
      create: {
        userId: adminUser.id,
        username,
        isConnected: true,
      },
    })

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
    console.error("Admin save Vinted account error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

async function syncVintedData(vintedAccountId: string) {
  try {
    const account = await prisma.vintedAccount.findUnique({
      where: { id: vintedAccountId },
    })

    if (!account || !account.isConnected) return

    // Fetch real data from database instead of mock data
    const [orders, reviews, listings] = await Promise.all([
      prisma.vintedOrder.findMany({
        where: { vintedAccountId },
        orderBy: { orderDate: "desc" },
      }),
      prisma.vintedReview.findMany({
        where: { vintedAccountId },
        orderBy: { reviewDate: "desc" },
      }),
      prisma.vintedListing.findMany({
        where: { vintedAccountId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Calculate stats from real data
    const totalSales = orders.filter(o => o.status === "delivered").length
    const positiveFeedback = reviews.filter(r => r.rating >= 4).length
    const negativeFeedback = reviews.filter(r => r.rating <= 2).length
    const neutralFeedback = reviews.filter(r => r.rating === 3).length
    const rating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0

    await prisma.$transaction(async (tx) => {
      await tx.vintedAccount.update({
        where: { id: vintedAccountId },
        data: {
          rating,
          totalSales,
          positiveFeedback,
          negativeFeedback,
          neutralFeedback,
          lastSync: new Date(),
        },
      })

      // Orders are already in DB, just update status if needed
      for (const order of orders) {
        await tx.vintedOrder.upsert({
          where: { vintedOrderId: order.vintedOrderId },
          update: {
            status: order.status,
            shippedDate: order.shippedDate,
            deliveredDate: order.deliveredDate,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
          },
          create: {
            vintedAccountId,
            vintedOrderId: order.vintedOrderId,
            buyerUsername: order.buyerUsername,
            itemTitle: order.itemTitle,
            itemPrice: order.itemPrice,
            status: order.status,
            orderDate: order.orderDate,
            shippedDate: order.shippedDate,
            deliveredDate: order.deliveredDate,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
          },
        })
      }

      // Reviews - only sync if they exist in DB
      for (const review of reviews) {
        await tx.vintedReview.upsert({
          where: { vintedReviewId: review.vintedReviewId },
          update: {
            rating: review.rating,
            comment: review.comment,
          },
          create: {
            vintedAccountId,
            vintedReviewId: review.vintedReviewId,
            buyerUsername: review.buyerUsername,
            rating: review.rating,
            comment: review.comment,
            orderId: review.orderId,
            reviewDate: review.reviewDate,
          },
        })
      }

      // Listings
      for (const listing of listings) {
        await tx.vintedListing.upsert({
          where: { vintedListingId: listing.vintedListingId },
          update: {
            title: listing.title,
            description: listing.description,
            price: listing.price,
            status: listing.status,
            size: listing.size,
            brand: listing.brand,
            category: listing.category,
            images: listing.images,
            listingUrl: listing.listingUrl,
          },
          create: {
            vintedAccountId,
            vintedListingId: listing.vintedListingId,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            status: listing.status,
            size: listing.size,
            brand: listing.brand,
            category: listing.category,
            images: listing.images,
            listingUrl: listing.listingUrl,
          },
        })
      }
    })
  } catch (error) {
    console.error("Vinted sync error:", error)
  }
}