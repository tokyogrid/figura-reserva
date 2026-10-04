// Simple in-memory rate limiter for auth endpoints
// Note: For production, use Redis-based rate limiting (e.g., @upstash/ratelimit)

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000 // 1 minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { success: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}, 5 * 60 * 1000) // Clean every 5 minutes