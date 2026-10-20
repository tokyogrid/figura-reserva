import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

const BASE_URL = "https://tokyogridstore.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/request`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/vinted`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/verify`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ]

  const productRoutes = await prisma.product
    .findMany({
      where: {
        status: "AVAILABLE",
        isHidden: false,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    })
    .then((products) =>
      products.map((product) => ({
        url: `${BASE_URL}/catalog/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )

  const orderRoutes = await prisma.order
    .findMany({
      where: {
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    })
    .then((orders) =>
      orders.map((order) => ({
        url: `${BASE_URL}/order/${order.id}`,
        lastModified: order.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.4,
      }))
    )

  return [...staticRoutes, ...productRoutes, ...orderRoutes]
}