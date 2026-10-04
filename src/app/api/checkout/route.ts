import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession } from "@/lib/stripe"
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/email"
import { sendNewOrderTelegram } from "@/lib/telegram"
import { checkCSRF } from "@/lib/csrf"

export async function POST(request: NextRequest) {
  // CSRF protection
  if (!(await checkCSRF(request))) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { items, shippingCost, total, purchaseOption, customerName, email, phone, address, city, postalCode, country, notes } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Verify stock availability
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 })
      }
      const available = product.stock - product.reserved
      if (available < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }
    }

    // Create order in DB (pending)
    const order = await prisma.order.create({
      data: {
        email,
        customerName,
        phone,
        address: purchaseOption === "vinted" ? "Vinted sale - no shipping address needed" : address,
        city: purchaseOption === "vinted" ? "N/A" : city,
        postalCode: purchaseOption === "vinted" ? "N/A" : postalCode,
        country: purchaseOption === "vinted" ? "N/A" : country,
        subtotal: total - shippingCost,
        shippingCost: purchaseOption === "vinted" ? 0 : shippingCost,
        total: purchaseOption === "vinted" ? total - shippingCost : total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        notes: notes + (purchaseOption === "vinted" ? " | VINTED SALE" : ""),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    // Reserve stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { reserved: { increment: item.quantity } },
      })
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const session = await createCheckoutSession({
      items: items.map((item: any) => ({
        name: item.name,
        description: item.productId,
        images: [],
        amount: item.price,
        quantity: item.quantity,
      })),
      customerEmail: email,
      successUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
        purchaseOption,
      },
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    // Send Telegram notification (fire and forget)
    sendNewOrderTelegram({
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
    }).catch((err) => console.error("Telegram notification failed:", err))

    // Send admin email notification (fire and forget)
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
    }).catch((err) => console.error("Admin email notification failed:", err))

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Error processing order" }, { status: 500 })
  }
}