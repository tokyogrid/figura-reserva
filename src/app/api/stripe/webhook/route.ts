import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
  sendAdminPaymentFailedEmail,
  sendAdminOrderCancelledEmail,
} from "@/lib/email"
import {
  sendPaymentFailedTelegram,
  sendOrderCancelledTelegram,
  sendNewOrderTelegram,
} from "@/lib/telegram"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    console.error("❌ Firma de Stripe ausente")
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
    console.error("❌ Error de verificación de firma:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const metadata = session.metadata || {}
        const orderId = metadata.orderId
        const purchaseOption = metadata.purchaseOption || "direct"

        console.log("💳 Webhook Stripe: Pago completado para la sesión", session.id)

        if (!orderId) {
          console.warn("⚠️ Evento sin 'orderId' en metadata. (Si usaste 'stripe trigger', no incluye metadata real).")
          break
        }

        const isVintedOrder = metadata.isVintedOrder === "true"
        const items = JSON.parse(metadata.items || "[]")
        const regularItems = JSON.parse(metadata.regularItems || "[]")
        const discountId = metadata.discountId || null

        // 1. Buscar si el pedido ya existe en la DB
        let order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: { include: { product: true } } },
        })

        if (order) {
          // Si existía en PENDING, recalcular totales y actualizar estado y pago
          let subtotal = 0
          for (const item of items) {
            subtotal += item.price * item.quantity
          }
          const shippingCost = isVintedOrder ? 0 : (subtotal < 10000 ? 500 : 0)
          const total = subtotal + shippingCost

          order = await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "CONFIRMED",
              paymentStatus: "PAID",
              stripePaymentIntentId: session.payment_intent as string,
              subtotal: subtotal,
              shippingCost: shippingCost,
              total: total,
            },
            include: { items: { include: { product: true } } },
          })
          console.log("✅ Pedido preexistente actualizado a CONFIRMED / PAID:", order.id)
        } else {
          // Si no existía, se crea directamente tras confirmar pago
          const vintedItemsCheck = items.filter((item: any) => item.isVinted)
          const vintedCodeVal = vintedItemsCheck.length > 0 || isVintedOrder ? generateVintedCode() : null

          // Calcular subtotal y shipping
          let subtotal = 0
          for (const item of items) {
            subtotal += item.price * item.quantity
          }
          const shippingCost = isVintedOrder ? 0 : (subtotal < 10000 ? 500 : 0) // 5€ para pedidos < 100€
          const total = subtotal + shippingCost

          order = await prisma.order.create({
            data: {
              id: orderId,
              email: metadata.email || session.customer_details?.email || "",
              customerName: metadata.customerName || session.customer_details?.name || "Cliente",
              phone: metadata.phone || "",
              address: metadata.address || "",
              city: metadata.city || "",
              postalCode: metadata.postalCode || "",
              country: metadata.country || "",
              subtotal: subtotal,
              shippingCost: shippingCost,
              total: total,
              status: "CONFIRMED",
              paymentStatus: "PAID",
              notes: metadata.notes || "",
              vintedCode: vintedCodeVal,
              isVintedOrder: isVintedOrder,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
              items: {
                create: items.map((item: any) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  isVinted: item.isVinted || false,
                })),
              },
            },
            include: { items: { include: { product: true } } },
          })
          console.log("✅ Nuevo pedido creado en la base de datos:", order.id)
        }

        // 2. Incrementar contador de descuento si aplica
        if (discountId) {
          await prisma.discount.update({
            where: { id: discountId },
            data: { usedCount: { increment: 1 } },
          }).catch((err) => console.error("Error actualizando uso de descuento:", err))
        }

        // 3. Reservar stock para artículos normales
        for (const item of regularItems) {
          if (item.productId) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { reserved: { increment: item.quantity } },
            }).catch((err) => console.error("Error reservando stock:", err))
          }
        }

        // 4. Enviar emails de confirmación
        await Promise.allSettled([
          sendOrderConfirmationEmail({
            email: order.email,
            customerName: order.customerName,
            orderId: order.id,
            items: order.items.map((item) => ({
              name: item.product?.name || "Producto",
              quantity: item.quantity,
              price: item.price,
              isVinted: item.isVinted,
            })),
            total: order.total,
          }),
          sendAdminNewOrderEmail({
            orderId: order.id,
            customerName: order.customerName,
            email: order.email,
            items: order.items.map((item) => ({
              name: item.product?.name || "Producto",
              quantity: item.quantity,
              price: item.price,
              isVinted: item.isVinted,
            })),
            total: order.total,
            purchaseOption,
          }),
        ])

        // 5. Enviar notificación por Telegram
        sendNewOrderTelegram({
          orderId: order.id,
          customerName: order.customerName,
          email: order.email,
          items: order.items.map((item) => ({
            name: item.product?.name || "Producto",
            quantity: item.quantity,
            price: item.price,
            isVinted: item.isVinted,
          })),
          total: order.total,
          purchaseOption: isVintedOrder ? "vinted" : "direct",
        }).catch((err) => console.error("Notificación de Telegram fallida:", err))

        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              stripePaymentIntentId: paymentIntent.id,
            },
          }).catch((err) => console.error("Error en payment_intent.succeeded:", err))
        }
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
            for (const item of order.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { reserved: { decrement: item.quantity } },
              }).catch(() => {})
            }

            await prisma.order.update({
              where: { id: orderId },
              data: { status: "CANCELLED", paymentStatus: "FAILED" },
            })

            sendOrderCancelledTelegram({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Error Telegram cancelado:", err))

            sendAdminOrderCancelledEmail({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Error Email cancelado:", err))
          }
        }
        break
      }

      case "checkout.session.async_payment_failed":
      case "payment_intent.payment_failed": {
        const object = event.data.object as any
        const orderId = object.metadata?.orderId

        if (orderId) {
          const order = await prisma.order.findUnique({ where: { id: orderId } })

          if (order) {
            await prisma.order.update({
              where: { id: orderId },
              data: { paymentStatus: "FAILED" },
            })

            sendPaymentFailedTelegram({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Error Telegram pago fallido:", err))

            sendAdminPaymentFailedEmail({
              orderId: order.id,
              customerName: order.customerName,
              email: order.email,
            }).catch((err) => console.error("Error Email pago fallido:", err))
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Error en webhook handler:", error)
    return NextResponse.json({ received: true })
  }
}

function generateVintedCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "VT-"
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}