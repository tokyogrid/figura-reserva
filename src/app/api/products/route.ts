import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const series = searchParams.get("series") || ""
  const inStock = searchParams.get("inStock") === "true"
  const sort = searchParams.get("sort") || "featured"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where: any = {
    status: { in: ["AVAILABLE", "LOW_STOCK", "PRE_ORDER"] },
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { series: { contains: search, mode: "insensitive" } },
      { character: { contains: search, mode: "insensitive" } },
      { manufacturer: { contains: search, mode: "insensitive" } },
    ]
  }

  if (category) where.category = category
  if (series) where.series = series
  if (inStock) where.stock = { gt: 0 }

  const orderBy: any = {}
  switch (sort) {
    case "price-asc":
      orderBy.price = "asc"
      break
    case "price-desc":
      orderBy.price = "desc"
      break
    case "newest":
      orderBy.createdAt = "desc"
      break
    case "name":
      orderBy.name = "asc"
      break
    default:
      orderBy.sortOrder = "asc"
  }

  const [products, categories, seriesList, total] = await Promise.all([
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

  return NextResponse.json({
    products,
    categories: categories.map((c) => c.category).filter(Boolean) as string[],
    series: seriesList.map((s) => s.series).filter(Boolean) as string[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}