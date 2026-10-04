import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import { countries, isValidCountry } from "@/lib/countries"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (existingUser.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Update user with new verification code
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
        emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    // Send verification email
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      await sendVerificationEmail({ email, name: user.name || "User", code: verificationCode })
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Verification code sent to your email",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}