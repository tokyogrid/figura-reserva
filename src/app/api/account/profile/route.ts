import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkCSRF } from "@/lib/csrf"

export async function PUT(request: NextRequest) {
  // CSRF protection
  if (!(await checkCSRF(request))) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 })
  }

  try {
    const session = await getSessionFromRequest(request)
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, city, postalCode, country, email } = body

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })
      if (existingUser && existingUser.id !== session.userId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        address,
        city,
        postalCode,
        country,
        email,
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        country: user.country,
      } 
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}