import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const limit = parseInt(searchParams.get("limit") || "50")

  const where: any = {}
  if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }, { series: { contains: search, mode: "insensitive" } }, { character: { contains: search, mode: "insensitive" } }]
  if (status) where.status = status

  const requests = await prisma.figureRequest.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, include: { product: true } })
  return NextResponse.json({ requests })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  try {
    const { status, productId } = await request.json()
    const updated = await prisma.figureRequest.update({ where: { id }, data: { status, productId: productId || null } })
    return NextResponse.json({ request: updated })
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}