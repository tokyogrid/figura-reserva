import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const requestRecord = await prisma.figureRequest.findUnique({
      where: { id },
    })

    if (!requestRecord) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Check if the request belongs to the current user
    if (requestRecord.email !== session.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ request: requestRecord })
  } catch (error) {
    console.error("Get request error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}