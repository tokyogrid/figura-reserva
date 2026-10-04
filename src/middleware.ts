import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSessionFromRequest } from "@/lib/auth"

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

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}