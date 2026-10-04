import { NextResponse } from "next/server"
import { generateCSRFToken, csrfCookie } from "@/lib/csrf"

export async function GET() {
  const token = await generateCSRFToken()
  const response = NextResponse.json({ success: true })
  const cookie = csrfCookie(token)
  response.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    maxAge: cookie.maxAge,
    path: cookie.path,
  })
  return response
}