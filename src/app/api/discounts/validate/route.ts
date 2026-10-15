import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { code, cartTotal } = body

    if (!code) {
      return NextResponse.json({ error: "Discount code is required" }, { status: 400 })
    }

    const discount = await prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!discount) {
      return NextResponse.json({ error: "Invalid discount code" }, { status: 404 })
    }

    if (!discount.isActive) {
      return NextResponse.json({ error: "This discount code is no longer active" }, { status: 400 })
    }

    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return NextResponse.json({ error: "This discount code has expired" }, { status: 400 })
    }

    if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json({ error: "This discount code has reached its usage limit" }, { status: 400 })
    }

    // Check if user has already used this discount
    const existingUsage = await prisma.discountUsage.findUnique({
      where: {
        userId_discountId: {
          userId: session.userId,
          discountId: discount.id,
        },
      },
    })

    if (existingUsage) {
      return NextResponse.json({ error: "You have already used this discount code" }, { status: 400 })
    }

    // Check minimum order amount
    if (discount.minOrder > 0 && cartTotal !== undefined && cartTotal < discount.minOrder) {
      return NextResponse.json({ 
        error: `Minimum order of ${(discount.minOrder / 100).toFixed(2)}€ required for this discount` 
      }, { status: 400 })
    }

    const discountData = {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      minOrder: discount.minOrder,
      discountId: discount.id,
    }

    return NextResponse.json({ discount: discountData })
  } catch (error) {
    console.error("Error validating discount:", error)
    return NextResponse.json({ error: "Error validating discount" }, { status: 500 })
  }
}