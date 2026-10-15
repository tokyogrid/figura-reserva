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
      // Use raw query for case-insensitive search on SQLite
      const searchLower = search.toLowerCase()
      const searchPattern = `%${searchLower}%`
      
      // Build WHERE clause for raw query
      const whereClauses = ['status IN ("AVAILABLE", "LOW_STOCK", "PRE_ORDER")']
      const params: any[] = []
      
      if (category) {
        whereClauses.push('category = ?')
        params.push(category)
      }
      if (series) {
        whereClauses.push('series = ?')
        params.push(series)
      }
      if (inStock) {
        whereClauses.push('stock > 0')
      }
      
      // Search across name, series, character, manufacturer (case-insensitive)
      whereClauses.push(`(
        LOWER(name) LIKE ? OR 
        LOWER(series) LIKE ? OR 
        LOWER(character) LIKE ? OR 
        LOWER(manufacturer) LIKE ?
      )`)
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)

      const whereSQL = whereClauses.join(' AND ')

      // Get total count
      const countResult = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
        `SELECT COUNT(*) as count FROM Product WHERE ${whereSQL}`,
        ...params
      )
      total = Number(countResult[0]?.count || 0)

      // Get paginated products
      const orderByMap: Record<string, string> = {
        'price-asc': 'price ASC',
        'price-desc': 'price DESC',
        'newest': 'createdAt DESC',
        'name': 'name ASC',
        'featured': 'sortOrder ASC'
      }
      const orderBySQL = orderByMap[sort] || 'sortOrder ASC'
      
      products = await prisma.$queryRawUnsafe<Array<any>>(
        `SELECT * FROM Product WHERE ${whereSQL} ORDER BY ${orderBySQL} LIMIT ? OFFSET ?`,
        ...params,
        limit,
        (page - 1) * limit
      )
    } else {
      // No search - use regular Prisma query
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