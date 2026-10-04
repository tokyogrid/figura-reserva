const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn("Telegram credentials not configured. Notifications will be disabled.")
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100)
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Telegram API error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to send Telegram notification:", error)
    return false
  }
}

export async function sendNewOrderTelegram({
  orderId,
  customerName,
  email,
  items,
  total,
  purchaseOption,
}: {
  orderId: string
  customerName: string
  email: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  purchaseOption: "direct" | "vinted"
}) {
  const itemsText = items
    .map((item) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price)}`)
    .join("\n")

  const text = `
🔔 <b>NEW ORDER</b> 🔔

📦 <b>Order ID:</b> <code>${orderId}</code>
👤 <b>Customer:</b> ${customerName} (${email})
💳 <b>Type:</b> ${purchaseOption === "vinted" ? "Vinted Sale" : "Direct Shipping"}
💰 <b>Total:</b> <b>${formatPrice(total)}</b>

📋 <b>Items:</b>
${itemsText}

🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}">View in Admin</a>
`

  return sendTelegramMessage(text)
}

export async function sendNewRequestTelegram({
  requestId,
  name,
  email,
  series,
  character,
  manufacturer,
  scale,
  budgetMin,
}: {
  requestId: string
  name: string
  email: string
  series?: string
  character: string
  manufacturer?: string
  scale?: string
  budgetMin?: number
}) {
  const budgetText = budgetMin ? formatPrice(budgetMin) : "Not specified"

  const text = `
📝 <b>NEW FIGURE REQUEST</b> 📝

🆔 <b>Request ID:</b> <code>${requestId}</code>
👤 <b>Customer:</b> ${name} (${email})
🎭 <b>Figure:</b> ${character}
${series ? `📺 <b>Series:</b> ${series}` : ""}
${manufacturer ? `🏭 <b>Manufacturer:</b> ${manufacturer}` : ""}
${scale ? `📏 <b>Scale:</b> ${scale}` : ""}

🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/requests/${requestId}">View in Admin</a>
`

  return sendTelegramMessage(text)
}

export async function sendPaymentFailedTelegram({
  orderId,
  customerName,
  email,
}: {
  orderId: string
  customerName: string
  email: string
}) {
  const text = `
⚠️ <b>PAYMENT FAILED</b> ⚠️

📦 <b>Order ID:</b> <code>${orderId}</code>
👤 <b>Customer:</b> ${customerName} (${email})

The payment for this order has failed. Stock has been released.
`

  return sendTelegramMessage(text)
}

export async function sendOrderCancelledTelegram({
  orderId,
  customerName,
  email,
}: {
  orderId: string
  customerName: string
  email: string
}) {
  const text = `
❌ <b>ORDER CANCELLED</b> ❌

📦 <b>Order ID:</b> <code>${orderId}</code>
👤 <b>Customer:</b> ${customerName} (${email})

Order was cancelled (session expired). Stock has been released.
`

  return sendTelegramMessage(text)
}