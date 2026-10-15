import { NextRequest, NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendOrderStatusUpdateEmail } from "@/lib/email"

const VINTED_STATUS_FLOW = ["CONFIRMED", "PURCHASING_IN_JAPAN", "AVAILABLE_ON_VINTED"]

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: "Forbidden - no session" }, { status: 403 })

  const { id } = await params
  try {
    const body = await request.json()
    const { status } = body

    if (!VINTED_STATUS_FLOW.includes(status)) {
      return NextResponse.json({ error: "Invalid vinted status" }, { status: 400 })
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    })

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (!currentOrder.isVintedOrder) {
      return NextResponse.json({ error: "Order is not a vinted order" }, { status: 400 })
    }

    const currentIndex = ["CONFIRMED", "PURCHASING_IN_JAPAN", "AVAILABLE_ON_VINTED"].indexOf(currentOrder.status)
    const newIndex = ["CONFIRMED", "PURCHASING_IN_JAPAN", "AVAILABLE_ON_VINTED"].indexOf(status)

    if (newIndex <= currentIndex) {
      return NextResponse.json({ error: "Cannot move backwards in status flow" }, { status: 400 })
    }

    if (newIndex !== currentIndex + 1) {
      return NextResponse.json({ error: "Cannot skip status steps" }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { product: true } } },
    })

    // Send email notification
    try {
      await sendOrderStatusUpdateEmail({
        email: updated.email,
        customerName: updated.customerName,
        orderId: updated.id,
        oldStatus: currentOrder.status,
        newStatus: status,
        orderItems: updated.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          isVinted: item.isVinted,
        })),
        vintedCode: updated.vintedCode,
      })
    } catch (emailError) {
      console.error("Failed to send order status update email:", emailError)
    }

    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error("Error updating vinted order status:", error)
    return NextResponse.json({ error: "Error updating vinted order status" }, { status: 500 })
  }
}