import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Tokyo Grid <noreply@tokyogridstore.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100)
}

export async function sendFigureRequestConfirmationEmail({
  email,
  name,
  requestId,
}: {
  email: string
  name: string
  requestId: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Request Received - ${requestId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Request Received</h1>
        <p>Hi ${name},</p>
        <p>We received your request for a figure. Our team will review it and contact you if we can find it.</p>
        <p>Your request ID: <strong>${requestId}</strong></p>
        <p>We'll email you if we find the figure you're looking for.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 14px;">Tokyo Grid - Anime Figures from Japan</p>
      </div>
    `,
  })
}

export async function sendAdminFigureRequestEmail({
  requestId,
  name,
  email,
  series,
  character,
  budgetMin,
  budgetMax,
}: {
  requestId: string
  name: string
  email: string
  series?: string
  character: string
  budgetMin?: number
  budgetMax?: number
}) {
  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified"
    if (min && max) return `€${(min/100).toFixed(0)} - €${(max/100).toFixed(0)}`
    if (min) return `From €${(min/100).toFixed(0)}`
    if (max) return `Up to €${(max/100).toFixed(0)}`
    return "Not specified"
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: process.env.ADMIN_EMAIL!,
    subject: `New Figure Request: ${requestId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">New Figure Request</h1>
        <p><strong>Request ID:</strong> ${requestId}</p>
        <p><strong>Customer:</strong> ${name} (${email})</p>
        ${series ? `<p><strong>Series:</strong> ${series}</p>` : ""}
        <p><strong>Figure:</strong> ${character}</p>
        <p><strong>Budget:</strong> ${formatBudget(budgetMin, budgetMax)}</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/requests/${requestId}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">View in Admin</a>
        </p>
      </div>
    `,
  })
}

export async function sendOrderConfirmationEmail({
  email,
  customerName,
  orderId,
  items,
  total,
}: {
  email: string
  customerName: string
  orderId: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Order Confirmed</h1>
        <p>Hi ${customerName},</p>
        <p>Thank you for your order! Your payment has been processed successfully.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 8px;">Item</th>
              <th style="text-align: right; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">${item.name}</td>
                <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">${formatPrice(item.price)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <p style="text-align: right; font-size: 18px; font-weight: bold;">Total: ${formatPrice(total)}</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 14px;">Tokyo Grid - Anime Figures from Japan</p>
      </div>
    `,
  })
}

export async function sendAdminNewOrderEmail({
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
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Order: ${orderId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">New Order Received</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName} (${email})</p>
        <p><strong>Type:</strong> ${purchaseOption === "vinted" ? "Vinted Sale" : "Direct Shipping"}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 8px;">Item</th>
              <th style="text-align: right; padding: 8px;">Qty</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px;">${item.name}</td>
                <td style="text-align: right; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">${formatPrice(item.price)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <p style="text-align: right; font-size: 18px; font-weight: bold;">Total: ${formatPrice(total)}</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">View in Admin</a>
        </p>
      </div>
    `,
  })
}

export async function sendAdminPaymentFailedEmail({
  orderId,
  customerName,
  email,
}: {
  orderId: string
  customerName: string
  email: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: "tokyogridstore@gmail.com",
    subject: `⚠️ Payment Failed: ${orderId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">⚠️ Payment Failed</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName} (${email})</p>
        <p>The payment for this order has failed. Stock has been released.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px;">View in Admin</a>
        </p>
      </div>
    `,
  })
}

export async function sendAdminOrderCancelledEmail({
  orderId,
  customerName,
  email,
}: {
  orderId: string
  customerName: string
  email: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: "tokyogridstore@gmail.com",
    subject: `❌ Order Cancelled: ${orderId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">❌ Order Cancelled</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${customerName} (${email})</p>
        <p>Order was cancelled (session expired). Stock has been released.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px;">View in Admin</a>
        </p>
      </div>
    `,
  })
}

export async function sendVerificationEmail({
  email,
  name,
  code,
}: {
  email: string
  name: string
  code: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your Tokyo Grid account",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1f2937;">Welcome to Tokyo Grid!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account. Please use the following verification code to complete your registration:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; background: #3b82f6; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; font-family: monospace;">
            ${code}
          </span>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 14px;">Tokyo Grid - Anime Figures from Japan</p>
      </div>
    `,
  })
}