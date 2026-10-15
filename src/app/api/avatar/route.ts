import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Generate avatar with user initials
  const sessionWithName = session as { userId: string; email?: string; name?: string }
  const name = sessionWithName.name || sessionWithName.email || "U"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Generate a consistent color based on user ID
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
  ]
  const colorIndex = session.userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const bgColor = colors[colorIndex]

  // Return SVG avatar
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="${bgColor.replace("bg-", "").replace("-500", "")}"/>
      <text x="16" y="20" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}