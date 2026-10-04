import { NextRequest, NextResponse } from "next/server"
import { createUserSession, userSessionCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import { countries, isValidCountry } from "@/lib/countries"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting: 3 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const rl = rateLimit(`register:${ip}`, 3, 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": Math.ceil((rl.resetTime - Date.now()) / 1000).toString() } }
    )
  }

  try {
    const body = await request.json()
    const { email, password, name, address, city, postalCode, country } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password and name required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 })
      } else {
        // User exists but not verified - update their data and resend verification
        const passwordHash = await bcrypt.hash(password, 12)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        await prisma.user.update({
          where: { email },
          data: {
            passwordHash,
            name,
            address,
            city,
            postalCode,
            country: country || "ES",
            emailVerificationCode: verificationCode,
            emailVerificationExpires: expiresAt,
          },
        })

        await sendVerificationEmail({ email, name, code: verificationCode })

        return NextResponse.json({
          success: true,
          requiresVerification: true,
          message: "Verification code sent to your email",
        })
      }
    }

    // Validate country
    if (country && !isValidCountry(country)) {
      return NextResponse.json({ error: "Invalid country" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        address,
        city,
        postalCode,
        country: country || "ES",
        emailVerificationCode: verificationCode,
        emailVerificationExpires: expiresAt,
      },
    })

    // Send verification email
    await sendVerificationEmail({ email, name, code: verificationCode })

    // Return success but indicate verification is needed
    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Verification code sent to your email",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}