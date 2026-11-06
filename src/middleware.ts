import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_FILE = /\.(.*)$/;

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function applySecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

const authPaths = ['/admin', '/checkout', '/account', '/order'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, Next.js internals, sitemap, robots, feed
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE.test(pathname) ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/feed'
  ) {
    const response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  // Run next-intl middleware for localized routes
  const response = intlMiddleware(request);

  // Apply security headers to all responses
  applySecurityHeaders(response);

  // Auth protection for protected routes (outside locale prefix)
  const localePathname = pathname.replace(/^\/(es|en)/, '') || '/';
  const needsAuth = authPaths.some(path => localePathname.startsWith(path));
  
  if (needsAuth) {
    // Check for admin session
    const cookieHeader = request.headers.get('cookie');
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      // Admin auth check - the actual auth is handled in the page/API
      // We just ensure the middleware doesn't block it
    }
    // For checkout, account, order - the page components handle auth
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except api, _next, static files, sitemap, robots, feed
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.ico$|.*\\.svg$|sitemap.xml|robots.txt|feed).*)',
  ],
};