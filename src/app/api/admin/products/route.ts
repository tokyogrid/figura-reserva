import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")

  const where: any = {}
  if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { series: { contains: search, mode: "insensitive" } }, { character: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }]
  if (status) where.status = status

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const { name, description, price, originalPrice, images, category, series, character, manufacturer, scale, releaseDate, stock, status, isFeatured, sortOrder } = body

    if (!name || !price || !images) return NextResponse.json({ error: "Name, price, images required" }, { status: 400 })

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-")
    let finalSlug = slug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) { finalSlug = `${slug}-${counter}++` }

    const product = await prisma.product.create({
      data: { 
        name, 
        slug: finalSlug, 
        description, 
        price: Math.round(parseFloat(price) * 100), 
        originalPrice: originalPrice ? Math.round(parseFloat(originalPrice) * 100) : null, 
        images: JSON.stringify(Array.isArray(images) ? images : [images]), 
        category, 
        series, 
        character, 
        manufacturer, 
        scale, 
        releaseDate: releaseDate ? new Date(releaseDate) : null, 
        stock: parseInt(stock) || 0, 
        status: status || "AVAILABLE", 
        isFeatured: Boolean(isFeatured), 
        sortOrder: parseInt(sortOrder) || 0 
      },
    })
    return NextResponse.json({ product }, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: "Error creating" }, { status: 500 }) }
}