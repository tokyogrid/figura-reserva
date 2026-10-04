import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin, createUserSession, userSessionCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rl = rateLimit(`login:${ip}`, 5, 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": Math.ceil((rl.resetTime - Date.now()) / 1000).toString() } }
    )
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.emailVerified) {
      return NextResponse.json({ 
        error: "Email not verified. Please verify your email first.", 
        requiresVerification: true,
        email: user.email 
      }, { status: 401 })
    }

    // Create session
    const token = await createUserSession(user.id, user.email)

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
    const cookie = userSessionCookie(token)
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      maxAge: cookie.maxAge,
      path: cookie.path,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}