import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const discount = await prisma.discount.findUnique({
      where: { id },
    })

    if (!discount) {
      return NextResponse.json({ error: "Discount not found" }, { status: 404 })
    }

    return NextResponse.json({ discount })
  } catch (error) {
    console.error("Error fetching discount:", error)
    return NextResponse.json({ error: "Error fetching discount" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { code, type, value, minOrder, usageLimit, expiresAt, isActive } = body

    const existingDiscount = await prisma.discount.findUnique({
      where: { id },
    })

    if (!existingDiscount) {
      return NextResponse.json({ error: "Discount not found" }, { status: 404 })
    }

    if (code && code.toUpperCase() !== existingDiscount.code) {
      const codeExists = await prisma.discount.findUnique({
        where: { code: code.toUpperCase() },
      })

      if (codeExists) {
        return NextResponse.json({ error: "Discount code already exists" }, { status: 400 })
      }
    }

    if (type && type !== "percentage" && type !== "fixed") {
      return NextResponse.json({ error: "Type must be 'percentage' or 'fixed'" }, { status: 400 })
    }

    if (type === "percentage" && value !== undefined && (value < 0 || value > 100)) {
      return NextResponse.json({ error: "Percentage must be between 0 and 100" }, { status: 400 })
    }

    if (type === "fixed" && value !== undefined && value < 0) {
      return NextResponse.json({ error: "Fixed amount must be positive" }, { status: 400 })
    }

    const discount = await prisma.discount.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        type,
        value: value !== undefined ? Math.round(value * 100) : undefined,
        minOrder: minOrder !== undefined ? Math.round(minOrder * 100) : undefined,
        usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : undefined,
        expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : undefined,
        isActive,
      },
    })

    // Auto-deactivate if usage limit reached or expired
    const { shouldDeactivate, reason } = checkAndUpdateDiscountStatus({
      usageLimit: discount.usageLimit,
      usedCount: discount.usedCount,
      expiresAt: discount.expiresAt,
      isActive: discount.isActive,
    })

    if (shouldDeactivate && discount.isActive) {
      await prisma.discount.update({
        where: { id },
        data: { isActive: false },
      })
      discount.isActive = false
    }

    return NextResponse.json({ discount, autoDeactivated: shouldDeactivate, reason })
  } catch (error) {
    console.error("Error updating discount:", error)
    return NextResponse.json({ error: "Error updating discount" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    const discount = await prisma.discount.findUnique({
      where: { id },
    })

    if (!discount) {
      return NextResponse.json({ error: "Discount not found" }, { status: 404 })
    }

    await prisma.discount.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error deleting discount:", error)
    return NextResponse.json({ error: "Error deleting discount" }, { status: 500 })
  }
}