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
        { character: { contains: search } },
        { series: { contains: search } },
      ]
    }
    if (status) {
      where.status = status
    }

    const requests = await prisma.figureRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Get requests error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}