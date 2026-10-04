import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { CheckoutSuccessContent } from "./CheckoutSuccessContent"

export const metadata: Metadata = {
  title: "Pedido confirmado - Figura Reserva",
  description: "Tu reserva ha sido confirmada. Te avisaremos cuando compremos la figura en Japón.",
}

interface Props {
  searchParams: Promise<{ orderId?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams

  let order = null
  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    })

    // Convert Date fields to strings for the component
    if (order) {
      order = {
        ...order,
        createdAt: order.createdAt.toISOString(),
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
    }
  }

  return <CheckoutSuccessContent order={order} />
}