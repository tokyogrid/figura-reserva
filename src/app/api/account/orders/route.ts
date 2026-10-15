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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const where: any = { email: session.email }
    
    if (search) {
      where.OR = [
        { id: { contains: search } },
        { items: { some: { product: { name: { contains: search } } } } },
      ]
    }
    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        customerName: true,
        email: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        isVintedOrder: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}