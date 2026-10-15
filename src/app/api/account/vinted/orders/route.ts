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
      return NextResponse.json({ orders: [] })
    }

    const orders = await prisma.vintedOrder.findMany({
      where: { vintedAccountId: account.id },
      orderBy: { orderDate: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Get Vinted orders error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}