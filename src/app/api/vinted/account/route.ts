import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
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
    console.error("Get Vinted account error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}