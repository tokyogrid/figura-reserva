import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSessionFromRequest, getSessionFromRequest } from "@/lib/auth"

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

  // Proteger rutas de usuario (checkout, account, order)
  if (pathname.startsWith("/checkout") || pathname.startsWith("/account") || pathname.startsWith("/order")) {
    const session = await getSessionFromRequest(request)

    if (!session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()

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