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
  discount, // { type: "percentage" | "fixed", value: number, code: string }
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
  discount?: { type: "percentage" | "fixed"; value: number; code: string } | null
}) {
  // Calculate discount amount per item if discount exists
  const itemsWithDiscount = items.map((item) => {
    if (!discount) return item

    let discountAmount = 0
    if (discount.type === "percentage") {
      // discount.value is percentage * 100 (e.g., 15% = 1500)
      discountAmount = Math.round(item.amount * (discount.value / 100) / 100)
    } else {
      // Fixed discount: distribute proportionally
      const totalAmount = items.reduce((sum, i) => sum + i.amount * i.quantity, 0)
      const proportion = (item.amount * item.quantity) / totalAmount
      discountAmount = Math.round(discount.value * proportion)
    }

    const discountedAmount = Math.max(0, item.amount - discountAmount)
    return { ...item, amount: discountedAmount }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: itemsWithDiscount.map((item) => ({
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
    // Allow international addresses - EU + major countries
    shipping_address_collection: {
      allowed_countries: [
        "ES", "FR", "DE", "IT", "PT", "BE", "NL", "LU", "AT", "IE", "FI",
        "GR", "SK", "SI", "EE", "LV", "LT", "MT", "CY", "HR", "CZ", "HU",
        "PL", "RO", "BG", "SE", "DK", "NO", "CH", "GB", "US", "CA", "MX",
        "BR", "AR", "CL", "CO", "PE", "UY", "JP", "KR", "SG", "HK", "AU", "NZ"
      ],
    },
    // Add discount info to metadata for reference
    ...(discount && { metadata: { ...metadata, discountCode: discount.code, discountType: discount.type, discountValue: discount.value.toString() } }),
  })

  return session
}