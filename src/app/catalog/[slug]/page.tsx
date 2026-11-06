import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDetail } from "./ProductDetail"

interface Props {
  params: Promise<{ slug: string }>
}

function parseImagesSafe(images: string | null): string[] {
  if (!images) return []
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return images ? [images] : []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, images: true, price: true },
  })

  if (!product) {
    return { title: "Not found - Tokyo Grid" }
  }

  const imageUrls = parseImagesSafe(product.images)
  const firstImage = imageUrls[0] ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://tokyogridstore.com"}${imageUrls[0].startsWith("/") ? "" : "/"}${imageUrls[0]}` : undefined

  return {
    title: `${product.name} - Tokyo Grid`,
    description: product.description || `Reserve ${product.name} at Japan price. Shipping to Spain.`,
    alternates: {
      canonical: `/catalog/${slug}`,
    },
    openGraph: {
      url: `/catalog/${slug}`,
      locale: "es_ES",
      type: "website",
      title: product.name,
      description: product.description || "",
      images: firstImage ? [firstImage] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    notFound()
  }

  // Convert Date to string for ProductDetail component
  const productWithDateString = {
    ...product,
    releaseDate: product.releaseDate ? product.releaseDate.toISOString() : null,
  }

  return <ProductDetail product={productWithDateString} />
}