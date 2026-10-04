import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDetail } from "./ProductDetail"

interface Props {
  params: Promise<{ slug: string }>
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

  return {
    title: `${product.name} - Tokyo Grid`,
    description: product.description || `Reserve ${product.name} at Japan price. Shipping to Spain.`,
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: product.images[0] ? [product.images[0]] : [],
      type: "website",
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