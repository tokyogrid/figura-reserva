import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendFigureRequestConfirmationEmail, sendAdminFigureRequestEmail } from "@/lib/email"
import { sendNewRequestTelegram } from "@/lib/telegram"
import { rateLimit } from "@/lib/rate-limit"
import { checkCSRF } from "@/lib/csrf"

export async function POST(request: NextRequest) {
  // CSRF protection
  if (!(await checkCSRF(request))) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
  }

  // Rate limiting: 5 requests per hour per IP
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rl = rateLimit(`request:${ip}`, 5, 60 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": Math.ceil((rl.resetTime - Date.now()) / 1000).toString() } }
    )
  }

  try {
    const body = await request.json()
    console.log("[API Requests] Body keys:", Object.keys(body))
    console.log("[API Requests] Images length:", body.images?.length || 0)
    console.log("[API Requests] Images preview:", body.images?.substring(0, 100))
    const { name, email, series, figureName, manufacturer, scale, budgetMin, notes, images } = body

    if (!name || !email || !figureName) {
      return NextResponse.json({ error: "Name, email and figure name are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const requestRecord = await prisma.figureRequest.create({
      data: {
        name,
        email,
        series: series || null,
        character: figureName,
        manufacturer: manufacturer || null,
        scale: scale || null,
        budgetMin,
        notes: notes || null,
        images: images || "[]",
        status: "PENDING",
      },
    })

    // Send emails and Telegram notification (fire and forget)
    await Promise.all([
      sendFigureRequestConfirmationEmail({
        email,
        name,
        requestId: requestRecord.id,
      }),
      sendAdminFigureRequestEmail({
        requestId: requestRecord.id,
        name,
        email,
        series: series || undefined,
        character: figureName,
        budgetMin,
      }),
      sendNewRequestTelegram({
        requestId: requestRecord.id,
        name,
        email,
        series,
        character: figureName,
        manufacturer,
        scale,
        budgetMin,
      }).catch((err) => console.error("Telegram notification failed:", err)),
    ])

    return NextResponse.json({ success: true, id: requestRecord.id })
  } catch (error) {
    console.error("Figure request error:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}