export const dynamic = 'force-dynamic'

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
      return NextResponse.json({ reviews: [] })
    }

    const reviews = await prisma.vintedReview.findMany({
      where: { vintedAccountId: account.id },
      orderBy: { reviewDate: "desc" },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Get Vinted reviews error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}