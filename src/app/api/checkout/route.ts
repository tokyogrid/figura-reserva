import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession } from "@/lib/stripe"
import { checkCSRF } from "@/lib/csrf"
import { getSessionFromRequest } from "@/lib/auth"

function generateVintedCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "VT-"
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

function calculateShippingCost(subtotal: number, isVintedOrder: boolean): number {
  if (isVintedOrder) return 0
  return subtotal < 10000 ? 500 : 0 // 5€ para pedidos < 100€
}

export async function POST(request: NextRequest) {
  // Protección CSRF
  if (!(await checkCSRF(request))) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { items, shippingCost: frontendShippingCost, total: frontendTotal, purchaseOption, customerName, email, phone, address, city, postalCode, country, notes, discountCode } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Separar items Vinted y regulares
    const vintedItems = items.filter((item: any) => item.isVinted)
    const regularItems = items.filter((item: any) => !item.isVinted)

    // Prevenir pedidos mixtos (vinted + regular)
    if (vintedItems.length > 0 && regularItems.length > 0) {
      return NextResponse.json({ error: "Cannot mix vinted and regular items in the same order" }, { status: 400 })
    }

    const isVintedOrder = vintedItems.length > 0

    // Verificar stock y calcular subtotal
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    let subtotal = 0
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 })
      }
      const available = product.stock - product.reserved
      if (available < item.quantity) {
        console.warn(`Insufficient stock for ${product.name}: available=${available}, requested=${item.quantity}`)
      }
      subtotal += item.price * item.quantity
    }

    // Validar código de descuento si existe
    let discount = null
    let discountAmount = 0
    let discountId = null

    if (discountCode) {
      const foundDiscount = await prisma.discount.findUnique({
        where: { code: discountCode.toUpperCase() },
      })

      if (!foundDiscount) {
        return NextResponse.json({ error: "Invalid discount code" }, { status: 400 })
      }

      if (!foundDiscount.isActive) {
        return NextResponse.json({ error: "This discount code is no longer active" }, { status: 400 })
      }

      if (foundDiscount.expiresAt && new Date() > foundDiscount.expiresAt) {
        return NextResponse.json({ error: "This discount code has expired" }, { status: 400 })
      }

      if (foundDiscount.usageLimit !== null && foundDiscount.usedCount >= foundDiscount.usageLimit) {
        return NextResponse.json({ error: "This discount code has reached its usage limit" }, { status: 400 })
      }

      if (foundDiscount.minOrder > subtotal) {
        return NextResponse.json({ error: `Minimum order amount of ${(foundDiscount.minOrder / 100).toFixed(2)}€ required for this discount` }, { status: 400 })
      }

      const session = await getSessionFromRequest(request)
      if (session) {
        const existingUsage = await prisma.discountUsage.findUnique({
          where: {
            userId_discountId: {
              userId: session.userId,
              discountId: foundDiscount.id,
            },
          },
        })

        if (existingUsage) {
          return NextResponse.json({ error: "You have already used this discount code" }, { status: 400 })
        }
      }

      if (foundDiscount.type === "percentage") {
        discountAmount = Math.round((subtotal * foundDiscount.value) / 10000)
      } else {
        discountAmount = foundDiscount.value
      }

      discount = foundDiscount
      discountId = foundDiscount.id
    }

    // Generar código Vinted si corresponde
    const vintedItemsCheck = items.filter((item: any) => item.isVinted)
    const vintedCode = vintedItemsCheck.length > 0 || isVintedOrder ? generateVintedCode() : null

    const shippingCost = calculateShippingCost(subtotal, isVintedOrder)
    const finalTotal = subtotal - discountAmount + shippingCost

    // Generar ID único de la orden
    const orderId = generateOrderId()

    // Preparar items para Stripe (incluir shipping como line item)
    const stripeItems = items.map((item: any) => ({
      name: item.name,
      description: item.productId,
      images: [],
      amount: item.price,
      quantity: item.quantity,
    }))

    // Add shipping as a line item if not vinted and shipping > 0
    if (!isVintedOrder && shippingCost > 0) {
      stripeItems.push({
        name: "Envío estándar",
        description: "Shipping",
        images: [],
        amount: shippingCost,
        quantity: 1,
      })
    }

    // Crear sesión de Stripe enviando orderId en la metadata
    const session = await createCheckoutSession({
      items: stripeItems,
      customerEmail: email,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      metadata: {
        orderId,
        customerName,
        email,
        phone,
        address: isVintedOrder ? "Vinted sale - no shipping address needed" : address,
        city: isVintedOrder ? "N/A" : city,
        postalCode: isVintedOrder ? "N/A" : postalCode,
        country: isVintedOrder ? "N/A" : country,
        notes: (notes || "") + (discountCode ? ` | Discount: ${discountCode}` : "") + (vintedCode ? ` | Vinted: ${vintedCode}` : ""),
        isVintedOrder: isVintedOrder.toString(),
        vintedCode: vintedCode || "",
        items: JSON.stringify(
          items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            isVinted: item.isVinted || false,
          }))
        ),
        regularItems: JSON.stringify(
          regularItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        ),
        discountId: discountId || "",
        discountAmount: discountAmount.toString(),
        discountCode: discountCode || "",
        shippingCost: shippingCost.toString(),
      },
      discount: discount ? { type: discount.type as "percentage" | "fixed", value: discount.value, code: discountCode } : null,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Error processing order" }, { status: 500 })
  }
}