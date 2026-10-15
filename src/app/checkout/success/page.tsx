import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { CheckoutSuccessContent } from "./CheckoutSuccessContent"

export const metadata: Metadata = {
  title: "Pedido confirmado - Figura Reserva",
  description: "Tu reserva ha sido confirmada. Te avisaremos cuando compremos la figura en Japón.",
}

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  let order = null
  if (session_id) {
    const orderFromSession = await prisma.order.findUnique({
      where: { stripeSessionId: session_id },
      include: { items: { include: { product: true } } },
    })

    if (orderFromSession) {
      order = {
        ...orderFromSession,
        createdAt: orderFromSession.createdAt.toISOString(),
        items: orderFromSession.items.map(item => ({
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