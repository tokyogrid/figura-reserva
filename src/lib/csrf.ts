// CSRF Protection utilities
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const CSRF_SECRET = process.env.SESSION_PASSWORD || "dev-secret-change-in-production-min-32-chars"
const CSRF_SECRET_KEY = new TextEncoder().encode(CSRF_SECRET)
const CSRF_COOKIE_NAME = "csrf_token"
const CSRF_HEADER_NAME = "x-csrf-token"

export async function generateCSRFToken(): Promise<string> {
  return new SignJWT({ csrf: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(CSRF_SECRET_KEY)
}

export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, CSRF_SECRET_KEY)
    return payload.csrf === true
  } catch {
    return false
  }
}

export function csrfCookie(token: string) {
  return { 
    name: CSRF_COOKIE_NAME, 
    value: token, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax" as const, 
    maxAge: 60 * 60, // 1 hour
    path: "/" 
  }
}

export function clearCSRFCookie() {
  return { 
    name: CSRF_COOKIE_NAME, 
    value: "", 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax" as const, 
    maxAge: 0, 
    path: "/" 
  }
}

// Middleware helper to check CSRF on mutating requests
export async function checkCSRF(request: Request): Promise<boolean> {
  // Skip for safe methods
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true
  }

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  
  // Get token from cookie
  const cookieHeader = request.headers.get("cookie")
  let cookieToken: string | null = null
  if (cookieHeader) {
    const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=")
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    cookieToken = cookies[CSRF_COOKIE_NAME] || null
  }

  // Both must exist and match
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return false
  }

  // Verify token signature
  return verifyCSRFToken(headerToken)
}