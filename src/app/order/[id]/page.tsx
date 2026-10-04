import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { OrderTrackingContent } from "./OrderTrackingContent"
import { siteConfig } from "@/lib/site-config"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, customerName: true },
  })
  return {
    title: order ? `Order #${order.id.slice(0, 8)} - ${siteConfig.name}` : "Order Not Found",
  }
}

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!order) {
    notFound()
  }

  // Convert Date fields to strings for the component
  const orderWithDateStrings = {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      product: {
        ...item.product,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
        releaseDate: item.product.releaseDate ? item.product.releaseDate.toISOString() : null,
      }
    }))
  }

  return <OrderTrackingContent order={orderWithDateStrings} />
}