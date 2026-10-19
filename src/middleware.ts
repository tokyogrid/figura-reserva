import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.stripe.com https://*.vercel-analytics.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rutas de admin
  if (pathname.startsWith("/admin")) {
    // Permitir acceso a la página de login de admin sin autenticación
    if (pathname === "/admin/login") {
      return NextResponse.next()
    }

    const session = await getAdminSessionFromRequest(request)

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()

  // Security Headers
  response.headers.set("Content-Security-Policy", CSP_DIRECTIVES)
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("X-DNS-Prefetch-Control", "off")

  // HSTS for production
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/account/:path*",
    "/order/:path*",
    "/api/:path*",
  ],
}