import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createUserSession, userSessionCookie } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting: 10 requests per minute per IP (allow retries)
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rl = rateLimit(`verify:${ip}`, 10, 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": Math.ceil((rl.resetTime - Date.now()) / 1000).toString() } }
    )
  }

  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 })
    }

    // Verify the email
    const userUpdated = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
    })

    // Create session
    const token = await createUserSession(userUpdated.id, userUpdated.email)

    const response = NextResponse.json({ success: true, user: { id: userUpdated.id, email: userUpdated.email, name: userUpdated.name } })
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
    console.error("Verify error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}