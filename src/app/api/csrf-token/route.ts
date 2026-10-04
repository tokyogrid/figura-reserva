import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyCSRFToken } from "@/lib/csrf"

const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "x-csrf-token"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CSRF_COOKIE_NAME)?.value

  if (!token || !(await verifyCSRFToken(token))) {
    // Token missing or invalid - generate new one
    const { generateCSRFToken, csrfCookie } = await import("@/lib/csrf")
    const newToken = await generateCSRFToken()
    const response = NextResponse.json({ token: newToken })
    const cookie = csrfCookie(newToken)
    // Make it readable by JavaScript (not httpOnly)
    response.cookies.set({
      ...cookie,
      httpOnly: false,
      sameSite: "lax",
    })
    return response
  }

  // Return existing valid token
  return NextResponse.json({ token })
}