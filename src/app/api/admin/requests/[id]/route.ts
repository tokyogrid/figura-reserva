import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const requestRecord = await prisma.figureRequest.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!requestRecord) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ request: requestRecord })
  } catch (error) {
    console.error("Get request error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { status, productId } = await request.json()

    const updated = await prisma.figureRequest.update({
      where: { id },
      data: { status, productId: productId || null },
    })

    return NextResponse.json({ request: updated })
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}