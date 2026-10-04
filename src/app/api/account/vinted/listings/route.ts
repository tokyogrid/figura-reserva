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
      return NextResponse.json({ listings: [] })
    }

    const listings = await prisma.vintedListing.findMany({
      where: { vintedAccountId: account.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Get Vinted listings error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}