export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendOrderStatusUpdateEmail } from "@/lib/email"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: "Forbidden - no session" }, { status: 403 })
  
  const { id } = await params
  try {
    const body = await request.json()
    const { status, trackingNumber, trackingUrl } = body

    // Get current order to check for status change
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    })

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const oldStatus = currentOrder.status
    const oldPaymentStatus = currentOrder.paymentStatus

    const updated = await prisma.order.update({
      where: { id },
      data: { status, trackingNumber, trackingUrl },
      include: { items: { include: { product: true } } },
    })

    // Fetch items with isVinted field separately since Prisma doesn't include it by default
    const vintedItemsData = await prisma.orderItem.findMany({
      where: { orderId: id },
      select: { id: true, isVinted: true },
    })

    // Merge isVinted into items
    const itemsWithVinted = updated.items.map(item => ({
      ...item,
      isVinted: vintedItemsData.find(i => i.id === item.id)?.isVinted || false,
    }))

    // Send email notification if status changed
    if (oldStatus !== status) {
      try {
        await sendOrderStatusUpdateEmail({
          email: updated.email,
          customerName: updated.customerName,
          orderId: updated.id,
          oldStatus,
          newStatus: status,
          orderItems: itemsWithVinted.map(item => ({
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
    }

    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Error updating order" }, { status: 500 })
  }
}