import { NextRequest, NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function checkAndUpdateDiscountStatus(discount: {
  usageLimit: number | null
  usedCount: number
  expiresAt: Date | null
  isActive: boolean
}) {
  let shouldDeactivate = false
  let reason = ""

  if (discount.usageLimit !== null && discount.usedCount >= discount.usageLimit) {
    shouldDeactivate = true
    reason = "Usage limit reached"
  } else if (discount.expiresAt && new Date() > discount.expiresAt) {
    shouldDeactivate = true
    reason = "Expired"
  }

  return { shouldDeactivate, reason }
}

export async function GET(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request)
  console.log("[Admin Discounts] Session:", session ? { email: session.email, role: session.role } : "null")
  
  if (!session) return NextResponse.json({ error: "Unauthorized - no session" }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"

    const where = includeInactive ? {} : { isActive: true }

    const discounts = await prisma.discount.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    // Auto-deactivate expired or exhausted discounts
    for (const discount of discounts) {
      const { shouldDeactivate, reason } = checkAndUpdateDiscountStatus({
        usageLimit: discount.usageLimit,
        usedCount: discount.usedCount,
        expiresAt: discount.expiresAt,
        isActive: discount.isActive,
      })

      if (shouldDeactivate && discount.isActive) {
        await prisma.discount.update({
          where: { id: discount.id },
          data: { isActive: false },
        })
        discount.isActive = false
      }
    }

    return NextResponse.json({ discounts })
  } catch (error) {
    console.error("Error fetching discounts:", error)
    return NextResponse.json({ error: "Error fetching discounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { code, type, value, minOrder, usageLimit, expiresAt, isActive } = body

    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: "Code, type, and value are required" }, { status: 400 })
    }

    if (type !== "percentage" && type !== "fixed") {
      return NextResponse.json({ error: "Type must be 'percentage' or 'fixed'" }, { status: 400 })
    }

    if (type === "percentage" && (value < 0 || value > 100)) {
      return NextResponse.json({ error: "Percentage must be between 0 and 100" }, { status: 400 })
    }

    if (type === "fixed" && value < 0) {
      return NextResponse.json({ error: "Fixed amount must be positive" }, { status: 400 })
    }

    const existingDiscount = await prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (existingDiscount) {
      return NextResponse.json({ error: "Discount code already exists" }, { status: 400 })
    }

    const discount = await prisma.discount.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: Math.round(value * 100), // Store as cents for fixed, percentage * 100 for percentage
        minOrder: minOrder ? Math.round(minOrder * 100) : 0,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ discount }, { status: 201 })
  } catch (error) {
    console.error("Error creating discount:", error)
    return NextResponse.json({ error: "Error creating discount" }, { status: 500 })
  }
}