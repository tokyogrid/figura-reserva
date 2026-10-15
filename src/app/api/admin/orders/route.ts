import { NextRequest, NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request)
  console.log("[Admin Orders] Session:", session ? { email: session.email, role: session.role } : "null")
  
  if (!session) return NextResponse.json({ error: "Forbidden - no session" }, { status: 403 })

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