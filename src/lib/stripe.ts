import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
})

export async function createCheckoutSession({
  items,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata,
}: {
  items: Array<{
    name: string
    description?: string
    images?: string[]
    amount: number // en céntimos
    quantity: number
  }>
  customerEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata,
    shipping_address_collection: {
      allowed_countries: ["ES"],
    },
  })

  return session
}

export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  return stripe.paymentIntents.create({
    amount,
    currency: "eur",
    metadata,
    automatic_payment_methods: { enabled: true },
  })
}