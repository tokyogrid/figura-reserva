import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function NewProductPage() {
  const product = await prisma.product.create({
    data: { name: "New Figure", slug: `new-figure-${Date.now()}`, price: 0, images: JSON.stringify([]), stock: 0, status: "DISCONTINUED" }
  })
  redirect(`/admin/products/${product.id}/edit`)
}