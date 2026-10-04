import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSession()
  if (!session || !session.userId) {
    return NextResponse.json({ user: null })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      address: true,
      city: true,
      postalCode: true,
      country: true,
      role: true,
      emailVerified: true,
    }
  })

  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user })
}