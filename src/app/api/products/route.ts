import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const series = searchParams.get("series") || ""
    const inStock = searchParams.get("inStock") === "true"
    const sort = searchParams.get("sort") || "featured"
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    console.log("[API Products] Params:", { search, category, series, inStock, sort, page, limit })

    // Build where clause for Prisma
    const where: any = {
      status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] },
    }

    if (category) where.category = category
    if (series) where.series = series
    if (inStock) where.stock = { gt: 0 }

    // For search, we need case-insensitive search which isn't supported by Prisma on SQLite
    // Use raw query for search + combine with other filters
    let products
    let total

    if (search) {
      // Use Prisma's built-in case-insensitive search (works on PostgreSQL)
      const where: any = {
        status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] },
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { series: { contains: search, mode: "insensitive" } },
          { character: { contains: search, mode: "insensitive" } },
          { manufacturer: { contains: search, mode: "insensitive" } },
        ],
      }

      if (category) where.category = category
      if (series) where.series = series
      if (inStock) where.stock = { gt: 0 }

      const orderBy: any = {}
      switch (sort) {
        case "price-asc": orderBy.price = "asc"; break
        case "price-desc": orderBy.price = "desc"; break
        case "newest": orderBy.createdAt = "desc"; break
        case "name": orderBy.name = "asc"; break
        default: orderBy.sortOrder = "asc"
      }

      const [productsResult, count] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.product.count({ where }),
      ])

      products = productsResult
      total = count
    } else {
      // No search - use regular Prisma query
      const where: any = {
        status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] },
      }
      if (category) where.category = category
      if (series) where.series = series
      if (inStock) where.stock = { gt: 0 }

      const orderBy: any = {}
      switch (sort) {
        case "price-asc": orderBy.price = "asc"; break
        case "price-desc": orderBy.price = "desc"; break
        case "newest": orderBy.createdAt = "desc"; break
        case "name": orderBy.name = "asc"; break
        default: orderBy.sortOrder = "asc"
      }

      const [prismaProducts, categories, seriesList, count] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.product.findMany({
          where: { status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] } },
          select: { category: true },
          distinct: ["category"],
        }),
        prisma.product.findMany({
          where: { status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] }, series: { not: null } },
          select: { series: true },
          distinct: ["series"],
        }),
        prisma.product.count({ where }),
      ])
      
      products = prismaProducts
      total = count
    }

    console.log("[API Products] Found:", products.length, "products")

    // Get categories and series for filters (always use Prisma for these)
    const [categoriesResult, seriesResult] = await Promise.all([
      prisma.product.findMany({
        where: { status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] } },
        select: { category: true },
        distinct: ["category"],
      }),
      prisma.product.findMany({
        where: { status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] }, series: { not: null } },
        select: { series: true },
        distinct: ["series"],
      })
    ])

    return NextResponse.json({
      products,
      categories: categoriesResult.map((c) => c.category).filter(Boolean) as string[],
      series: seriesResult.map((s) => s.series).filter(Boolean) as string[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[API Products] Error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}