import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const SECRET_KEY = process.env.SESSION_PASSWORD
if (!SECRET_KEY) {
  throw new Error("SESSION_PASSWORD environment variable is required. Generate with: openssl rand -base64 32")
}
if (SECRET_KEY.length < 32) {
  throw new Error("SESSION_PASSWORD must be at least 32 characters")
}
const SECRET = new TextEncoder().encode(SECRET_KEY)
const ADMIN_COOKIE_NAME = "admin_session"
const USER_COOKIE_NAME = "user_session"

interface UserPayload extends JWTPayload {
  userId: string
  email: string
  role: "user" | "admin"
}

interface AdminPayload extends JWTPayload {
  email: string
  role: "admin"
}

export async function createAdminSession(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET)
}

export async function createUserSession(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET)
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify<UserPayload>(token, SECRET)
    return payload
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify<AdminPayload>(token, SECRET)
    if (payload.role !== "admin") return null
    return payload
  } catch {
    return null
  }
}

export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null
  const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=")
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  const token = cookies["user_session"] || cookies["admin_session"]
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function getAdminSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null
  const cookies = cookieHeader.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=")
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  const token = cookies["admin_session"]
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (payload.role !== "admin") return null
    return payload
  } catch {
    return null
  }
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  
  // Fail closed - if not configured, deny access
  if (!adminEmail || !adminPasswordHash) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured - admin access denied")
    return false
  }
  if (email !== adminEmail) return false
  return bcrypt.compare(password, adminPasswordHash)
}

export function userSessionCookie(token: string) {
  return { name: "user_session", value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, maxAge: 60*60*24*30, path: "/" }
}

export function adminSessionCookie(token: string) {
  return { name: "admin_session", value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, maxAge: 60*60*24*7, path: "/" }
}

export function clearUserCookie() {
  return { name: "user_session", value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 0, path: "/" }
}

export function clearAdminCookie() {
  return { name: "admin_session", value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, maxAge: 0, path: "/" }
}