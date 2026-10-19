import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyCSRFToken, generateCSRFToken, csrfCookie } from "@/lib/csrf"

const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "x-csrf-token"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(CSRF_COOKIE_NAME)?.value

  if (!token || !(await verifyCSRFToken(token))) {
    // Token missing or invalid - generate new one
    const newToken = await generateCSRFToken()
    const response = NextResponse.json({ token: newToken })
    // CSRF token cookie should be httpOnly to prevent XSS access
    response.cookies.set(csrfCookie(newToken))
    return response
  }

  // Return existing valid token
  return NextResponse.json({ token })
}