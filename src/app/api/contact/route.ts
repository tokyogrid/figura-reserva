import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendContactEmail, sendSupportTicketEmail, sendSupportTicketTelegram } from "@/lib/email"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting: 3 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rl = rateLimit(`contact:${ip}`, 3, 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": Math.ceil((rl.resetTime - Date.now()) / 1000).toString() } }
    )
  }
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create support ticket in database
    const ticket = await prisma.supportTicket.create({
      data: { name, email, subject, message, status: "OPEN" },
    })

    // Send email to tokyogridstore@gmail.com
    await sendSupportTicketEmail({
      ticketId: ticket.id.slice(0, 8).toUpperCase(),
      name,
      email,
      subject,
      message,
    })

    // Send Telegram notification (non-blocking)
    sendSupportTicketTelegram({
      ticketId: ticket.id.slice(0, 8).toUpperCase(),
      name,
      email,
      subject,
      message,
    }).catch(console.error)

    // Also send the original admin email
    await sendContactEmail({ name, email, subject, message })

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully",
      ticketId: ticket.id.slice(0, 8).toUpperCase(),
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Error sending message" }, { status: 500 })
  }
}