import { NextResponse } from "next/server"
import { verifyAdmin, createAdminSession, adminSessionCookie } from "@/lib/auth"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log("Login attempt:", email)
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const valid = await verifyAdmin(email, password)
    console.log("Verify result:", valid)
    
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createAdminSession(email)
    const cookie = adminSessionCookie(token)

    const response = NextResponse.json({ ok: true, redirect: "/admin" })
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      maxAge: cookie.maxAge,
      path: cookie.path,
    })
    
    console.log("Cookie set:", cookie.name)
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}