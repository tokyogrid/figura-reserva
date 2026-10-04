import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const paymentStatus = searchParams.get("paymentStatus") || ""
  const limit = parseInt(searchParams.get("limit") || "50")

  const where: any = {}
  if (search) where.OR = [{ id: { contains: search, mode: "insensitive" } }, { customerName: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }]
  if (status) where.status = status
  if (paymentStatus) where.paymentStatus = paymentStatus

  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, include: { items: { include: { product: true } } } })
  return NextResponse.json({ orders })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  try {
    const { status, trackingNumber, trackingUrl } = await request.json()
    const updated = await prisma.order.update({ where: { id }, data: { status, trackingNumber, trackingUrl } })
    return NextResponse.json({ order: updated })
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}