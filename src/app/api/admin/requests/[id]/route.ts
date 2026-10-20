import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendRequestStatusUpdateEmail } from "@/lib/email"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    console.log("[API Admin GET Request] Received ID:", id)

    const requestRecord = await prisma.figureRequest.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!requestRecord) {
      console.log("[Admin GET Request] Not found in DB for ID:", id)
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    console.log("[Admin GET Request] Found:", { id: requestRecord.id, name: requestRecord.name, imagesLen: requestRecord.images?.length || 0 })

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

    // Get current request to check for status change
    const currentRequest = await prisma.figureRequest.findUnique({
      where: { id },
    })

    if (!currentRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const oldStatus = currentRequest.status

    const updated = await prisma.figureRequest.update({
      where: { id },
      data: { status, productId: productId || null },
    })

    // Send email notification if status changed
    if (oldStatus !== status) {
      try {
        await sendRequestStatusUpdateEmail({
          email: updated.email,
          name: updated.name,
          requestId: updated.id,
          oldStatus,
          newStatus: status,
          figureName: updated.figureName || undefined,
          series: updated.series || undefined,
        })
      } catch (emailError) {
        console.error("Failed to send request status update email:", emailError)
      }
    }

    return NextResponse.json({ request: updated })
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}