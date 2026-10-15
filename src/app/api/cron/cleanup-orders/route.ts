import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOrderCancelledTelegram } from "@/lib/telegram"
import { sendAdminOrderCancelledEmail } from "@/lib/email"

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    
    const abandonedOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        paymentStatus: "UNPAID",
        createdAt: { lt: thirtyMinutesAgo },
      },
      include: { items: true },
    })

    let cleanedCount = 0

    for (const order of abandonedOrders) {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { reserved: { decrement: item.quantity } },
          })
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED", paymentStatus: "FAILED" },
        })
      })

      // Send notifications
      sendOrderCancelledTelegram({
        orderId: order.id,
        customerName: order.customerName,
        email: order.email,
      }).catch((err) => console.error("Telegram notification failed:", err))

      sendAdminOrderCancelledEmail({
        orderId: order.id,
        customerName: order.customerName,
        email: order.email,
      }).catch((err) => console.error("Admin email notification failed:", err))

      cleanedCount++
    }

    return NextResponse.json({ 
      success: true, 
      cleanedCount,
      message: `Cleaned up ${cleanedCount} abandoned UNPAID orders`
    })
  } catch (error) {
    console.error("Cleanup cron error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}