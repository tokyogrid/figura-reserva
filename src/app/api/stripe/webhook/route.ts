import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail, sendAdminPaymentFailedEmail, sendAdminOrderCancelledEmail } from "@/lib/email"
import { sendPaymentFailedTelegram, sendOrderCancelledTelegram } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const orderId = session.metadata?.orderId
        const purchaseOption = session.metadata?.purchaseOption || "direct"

        if (!orderId) break

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: { include: { product: true } } },
        })

        if (!order) break

        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "CONFIRMED",
            paymentStatus: "PAID",
            stripePaymentIntentId: session.payment_intent as string,
          },
        })

        // Send confirmation emails
        await Promise.all([
          sendOrderConfirmationEmail({
            email: order.email,
            customerName: order.customerName,
            orderId: order.id,
            items: order.items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: order.total,
          }),
          sendAdminNewOrderEmail({
            orderId: order.id,
            customerName: order.customerName,
            email: order.email,
            items: order.items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: order.total,
            purchaseOption,
          }),
        ])
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as any
        const orderId = session.metadata?.orderId

        if (orderId) {
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
          })

          if (order && order.status === "PENDING") {
            // Release reserved stock
            for (const item of order.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { reserved: { decrement: item.quantity } },
              })
            }

            await prisma.order.update({
              where: { id: orderId },
              data: { status: "CANCELLED", paymentStatus: "FAILED" },
            })

            // Send Telegram notification (fire and forget)
            sendOrderCancelledTelegram({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Telegram notification failed:", err))

            // Send admin email notification (fire and forget)
            sendAdminOrderCancelledEmail({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Admin email notification failed:", err))
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          const order = await prisma.order.findUnique({
            where: { id: orderId },
          })

          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "FAILED" },
          })

          // Send Telegram notification (fire and forget)
          if (order) {
            sendPaymentFailedTelegram({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Telegram notification failed:", err))

            // Send admin email notification (fire and forget)
            sendAdminPaymentFailedEmail({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Admin email notification failed:", err))
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    // Always return 200 to prevent Stripe retries
    return NextResponse.json({ received: true })
  }
}