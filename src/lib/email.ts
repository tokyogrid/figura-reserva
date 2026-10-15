import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Tokyo Grid <noreply@tokyogridstore.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
// Use a publicly accessible logo URL for emails (localhost won't work in email clients)
// In production, set NEXT_PUBLIC_LOGO_URL to your CDN/logo URL
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || `${APP_URL}/images/logo.png`
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Email template wrapper with logo and consistent styling
function emailTemplate({ title, preheader, children, footerText = "Tokyo Grid - Anime Figures from Japan" }: {
  title: string
  preheader?: string
  children: string
  footerText?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header with Logo -->
        <tr>
          <td style="padding: 32px 24px 16px; text-align: center; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);">
            <img src="${LOGO_URL}" alt="Tokyo Grid" style="max-width: 140px; height: auto; display: block; margin: 0 auto;" />
          </td>
        </tr>
        <!-- Preheader -->
        ${preheader ? `
        <tr>
          <td style="padding: 16px 24px 0; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">${preheader}</p>
          </td>
        </tr>
        ` : ''}
        <!-- Main Content -->
        <tr>
          <td style="padding: 24px;">
            ${children}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
            <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px;">${footerText}</p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              <a href="${APP_URL}" style="color: #6366f1; text-decoration: none;">${APP_URL}</a> · 
              <a href="mailto:support@tokyogrid.com" style="color: #6366f1; text-decoration: none;">Contact Support</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Button helper
function button({ text, url, color = "#6366f1" }: { text: string; url: string; color?: string }): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 16px auto;">
      <tr>
        <td style="border-radius: 8px; background: ${color};" bgcolor="${color}">
          <a href="${url}" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `
}

async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram not configured - skipping notification")
    return false
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })
    if (!res.ok) {
      const error = await res.text()
      console.error("Telegram send failed:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("Telegram send error:", error)
    return false
  }
}

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
    html: emailTemplate({
      title: "Request Received",
      preheader: "We've received your figure request and our team is reviewing it",
      children: `
        <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">Request Received</h1>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">We received your request for a figure. Our team will review it and contact you if we can find it.</p>
        <div style="background: #f0f4f8; border: 1px solid #d1d9e6; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your Request ID</p>
          <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: 700; font-family: monospace;">${requestId}</p>
        </div>
        <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">We'll email you if we find the figure you're looking for.</p>
      `,
    }),
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
    html: emailTemplate({
      title: "New Figure Request",
      preheader: `New request from ${name} (${email})`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">New Figure Request</h1>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Request ID</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${requestId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name} (${email})</td>
            </tr>
            ${series ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Series</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${series}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Figure</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${character}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Budget</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${formatBudget(budgetMin, budgetMax)}</td>
            </tr>
          </table>
        </div>
        ${button({ text: "View in Admin", url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/requests/${requestId}`, color: "#6366f1" })}
      `,
    }),
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
  items: Array<{ name: string; quantity: number; price: number; isVinted?: boolean }>
  total: number
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Order Confirmation - ${orderId}`,
    html: emailTemplate({
      title: "Order Confirmed",
      preheader: `Your order ${orderId} has been confirmed - Total: ${formatPrice(total)}`,
      children: `
        <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">Order Confirmed!</h1>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hi ${customerName},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Thank you for your order! Your payment has been processed successfully.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #dcfce7;">
            <span style="color: #166534; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order ID</span>
            <span style="color: #1f2937; font-size: 16px; font-weight: 700; font-family: monospace;">${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #166534; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Total Paid</span>
            <span style="color: #166534; font-size: 22px; font-weight: 700;">${formatPrice(total)}</span>
          </div>
        </div>

        <h2 style="margin: 32px 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Order Items</h2>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="text-align: left; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Item</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Qty</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 14px 16px; color: #1f2937; font-size: 15px;">${item.name} ${item.isVinted ? '<span style="margin-left: 8px; background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">VINTED</span>' : ''}</td>
                  <td style="text-align: right; padding: 14px 16px; color: #374151; font-size: 15px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 14px 16px; color: #1f2937; font-size: 15px; font-weight: 500;">${formatPrice(item.price)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 24px; text-align: right;">
          <p style="margin: 0; color: #374151; font-size: 16px; font-weight: 600;">Total: <span style="color: #1f2937; font-size: 20px;">${formatPrice(total)}</span></p>
        </div>

        <p style="margin-top: 32px; color: #374151; font-size: 15px; line-height: 1.6;">We'll notify you by email at each step of the process. Questions? Just reply to this email.</p>
      `,
    }),
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
  items: Array<{ name: string; quantity: number; price: number; isVinted?: boolean }>
  total: number
  purchaseOption: "direct" | "vinted"
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Order: ${orderId}`,
    html: emailTemplate({
      title: "New Order Received",
      preheader: `${purchaseOption === "vinted" ? "Vinted Sale" : "Direct Shipping"} - ${formatPrice(total)}`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">New Order Received</h1>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Order ID</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${customerName} (${email})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${purchaseOption === "vinted" ? "Vinted Sale" : "Direct Shipping"}</td>
            </tr>
          </table>
        </div>

        <h2 style="margin: 32px 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Order Items</h2>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="text-align: left; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Item</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Qty</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 14px 16px; color: #1f2937; font-size: 15px;">${item.name} ${item.isVinted ? '<span style="margin-left: 8px; background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">VINTED</span>' : ''}</td>
                  <td style="text-align: right; padding: 14px 16px; color: #374151; font-size: 15px;">${item.quantity}</td>
                  <td style="text-align: right; padding: 14px 16px; color: #1f2937; font-size: 15px; font-weight: 500;">${formatPrice(item.price)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 24px; text-align: right;">
          <p style="margin: 0; color: #374151; font-size: 18px; font-weight: 700;">Total: <span style="color: #1f2937;">${formatPrice(total)}</span></p>
        </div>

        ${button({ text: "View in Admin", url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}`, color: "#6366f1" })}
      `,
    }),
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
    html: emailTemplate({
      title: "Payment Failed",
      preheader: `Order ${orderId} - Payment failed, stock released`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 16px; color: #dc2626; font-size: 24px; font-weight: 700;">⚠️ Payment Failed</h1>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Order ID</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${customerName} (${email})</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">The payment for this order has failed. Stock has been released.</p>
        ${button({ text: "View in Admin", url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}`, color: "#dc2626" })}
      `,
    }),
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
    html: emailTemplate({
      title: "Order Cancelled",
      preheader: `Order ${orderId} - Cancelled (session expired), stock released`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 16px; color: #dc2626; font-size: 24px; font-weight: 700;">❌ Order Cancelled</h1>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Order ID</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${customerName} (${email})</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Order was cancelled (session expired). Stock has been released.</p>
        ${button({ text: "View in Admin", url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}`, color: "#dc2626" })}
      `,
    }),
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
    html: emailTemplate({
      title: "Welcome to Tokyo Grid!",
      preheader: "Use this code to verify your email address",
      children: `
        <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">Welcome to Tokyo Grid!</h1>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Thank you for creating an account. Please use the following verification code to complete your registration:</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; font-size: 36px; font-weight: 800; letter-spacing: 12px; padding: 20px 36px; border-radius: 12px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
            ${code}
          </div>
        </div>
        
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">This code will expire in <strong>15 minutes</strong>.</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
      `,
    }),
  })
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Contact: ${subject}`,
    html: emailTemplate({
      title: "New Contact Message",
      preheader: `Message from ${name} (${email})`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">New Contact Message</h1>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Name</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${subject}</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 8px; color: #374151; font-size: 14px; font-weight: 600;">Message:</p>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; white-space: pre-wrap; color: #374151; font-size: 15px; line-height: 1.7;">
          ${message}
        </div>
      `,
    }),
  })
}

// Send support ticket email to tokyogridstore@gmail.com
export async function sendSupportTicketEmail({
  ticketId,
  name,
  email,
  subject,
  message,
}: {
  ticketId: string
  name: string
  email: string
  subject: string
  message: string
}) {
  const subjectLabels: Record<string, string> = {
    forgot_password: "Forgot Password",
    account_help: "Account Help",
    order_issue: "Order Issue",
    other: "Other",
  }
  const subjectLabel = subjectLabels[subject] || subject

  await resend.emails.send({
    from: FROM_EMAIL,
    to: "tokyogridstore@gmail.com",
    subject: `[Ticket ${ticketId}] ${subjectLabel}`,
    html: emailTemplate({
      title: "New Support Ticket",
      preheader: `Ticket #${ticketId} - ${subjectLabel} from ${name}`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">New Support Ticket</h1>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Ticket ID</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subject</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${subjectLabel}</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 8px; color: #374151; font-size: 14px; font-weight: 600;">Message:</p>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; white-space: pre-wrap; color: #374151; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          ${message}
        </div>
        ${button({ text: "View in Admin", url: `${APP_URL}/admin/tickets/${ticketId}`, color: "#6366f1" })}
      `,
    }),
  })
}

// Send Telegram notification for new support ticket
export async function sendSupportTicketTelegram({
  ticketId,
  name,
  email,
  subject,
  message,
}: {
  ticketId: string
  name: string
  email: string
  subject: string
  message: string
}) {
  const subjectLabels: Record<string, string> = {
    forgot_password: "Forgot Password",
    account_help: "Account Help",
    order_issue: "Order Issue",
    other: "Other",
  }
  const subjectLabel = subjectLabels[subject] || subject

  const text = [
    "🎫 <b>New Support Ticket</b>",
    `<b>Ticket ID:</b> <code>${ticketId}</code>`,
    `<b>Name:</b> ${name}`,
    `<b>Email:</b> ${email}`,
    `<b>Subject:</b> ${subjectLabel}`,
    `<b>Message:</b> ${message}`,
    "",
    `<a href="${APP_URL}/admin/tickets/${ticketId}">View in Admin</a>`,
  ].join("\n")

  await sendTelegramMessage(text)
}

// Send order status update email to customer
export async function sendOrderStatusUpdateEmail({
  email,
  customerName,
  orderId,
  oldStatus,
  newStatus,
  orderItems,
  vintedCode,
}: {
  email: string
  customerName: string
  orderId: string
  oldStatus: string
  newStatus: string
  orderItems: Array<{ name: string; quantity: number; price: number; isVinted?: boolean }>
  vintedCode?: string | null
}) {
  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PURCHASING_IN_JAPAN: "Purchasing in Japan",
    AVAILABLE_ON_VINTED: "Available on Vinted",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
    PURCHASING_VINTED: "Purchasing (Vinted)",
  }

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    PURCHASING_IN_JAPAN: "#8b5cf6",
    AVAILABLE_ON_VINTED: "#ec4899",
    SHIPPED: "#6366f1",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
    REFUNDED: "#8b5cf6",
    PURCHASING_VINTED: "#8b5cf6",
  }

  const formatPrice = (cents: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(cents / 100)

  const statusColor = statusColors[newStatus] || "#6b7280"
  const statusLabel = statusLabels[newStatus] || newStatus
  const oldStatusLabel = statusLabels[oldStatus] || oldStatus

  const itemsHtml = `
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="text-align: left; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Item</th>
            <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Qty</th>
            <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Price</th>
            <th style="text-align: center; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Type</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems.map(item => `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 14px 16px; color: #1f2937; font-size: 15px;">${item.name} ${item.isVinted ? '<span style="margin-left: 8px; background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">VINTED</span>' : ''}</td>
              <td style="text-align: right; padding: 14px 16px; color: #374151; font-size: 15px;">${item.quantity}</td>
              <td style="text-align: right; padding: 14px 16px; color: #1f2937; font-size: 15px; font-weight: 500;">${formatPrice(item.price)}</td>
              <td style="text-align: center; padding: 14px 16px;">${item.isVinted ? '<span style="background:#8b5cf6;color:white;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;">Vinted</span>' : '<span style="color:#6b7280;font-size:13px;">Normal</span>'}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `

  const vintedInfo = vintedCode ? `
    <div style="background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px; color: #7c3aed; font-size: 14px; font-weight: 600;">Vinted Order Code</p>
      <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: 600; color: #5b21b6;">${vintedCode}</p>
      <p style="margin: 12px 0 0; font-size: 13px; color: #6b7280;">Keep this code to track your Vinted purchase. You'll complete the purchase on Vinted when the item is listed.</p>
    </div>
  ` : ""

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Order Update - ${orderId} - ${statusLabel}`,
    html: emailTemplate({
      title: "Order Status Updated",
      preheader: `Your order ${orderId} is now ${statusLabel}`,
      children: `
        <div style="background: ${statusColor}; border-radius: 12px 12px 0 0; padding: 28px 24px; text-align: center; margin: -24px -24px 0 -24px;">
          <h1 style="margin: 0 0 8px; color: white; font-size: 22px; font-weight: 700;">Order Status Updated</h1>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Order <strong style="color: white;">${orderId}</strong> status changed</p>
        </div>
        
        <p style="margin: 24px 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hi ${customerName},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Your order <strong>${orderId}</strong> status has been updated:</p>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin: 24px 0; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; flex-wrap: wrap;">
          <span style="font-size: 14px; color: #6b7280; line-height: 1;">From:</span>
          <span style="font-weight: 600; color: #374151; font-size: 15px; line-height: 1;">${oldStatusLabel}</span>
          <span style="color: ${statusColor}; font-size: 20px; font-weight: 700; line-height: 1; display: inline-flex; align-items: center;">→</span>
          <span style="font-weight: 700; color: ${statusColor}; font-size: 15px; line-height: 1;">${statusLabel}</span>
        </div>
        
        ${vintedInfo}
        
        <h3 style="margin: 32px 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Order Items</h3>
        ${itemsHtml}
        
        <p style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}" style="display: inline-block; color: #6366f1; font-weight: 600; text-decoration: none; font-size: 14px;">Track your order →</a>
        </p>
      `,
    }),
  })
}

// Send request status update email to customer
export async function sendRequestStatusUpdateEmail({
  email,
  name,
  requestId,
  oldStatus,
  newStatus,
  figureName,
  series,
}: {
  email: string
  name: string
  requestId: string
  oldStatus: string
  newStatus: string
  figureName?: string
  series?: string
}) {
  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    SEARCHING: "Searching",
    FOUND: "Found - Awaiting Confirmation",
    PURCHASING: "Purchasing",
    PURCHASED: "Purchased",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    UNAVAILABLE: "Unavailable",
  }

  const statusColors: Record<string, string> = {
    PENDING: "#f59e0b",
    SEARCHING: "#3b82f6",
    FOUND: "#8b5cf6",
    PURCHASING: "#8b5cf6",
    PURCHASED: "#10b981",
    SHIPPED: "#6366f1",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
    UNAVAILABLE: "#ef4444",
  }

  const statusColor = statusColors[newStatus] || "#6b7280"
  const statusLabel = statusLabels[newStatus] || newStatus
  const oldStatusLabel = statusLabels[oldStatus] || oldStatus

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Request Update - ${requestId} - ${statusLabel}`,
    html: emailTemplate({
      title: "Request Status Updated",
      preheader: `Your figure request ${requestId} is now ${statusLabel}`,
      children: `
        <div style="background: ${statusColor}; border-radius: 12px 12px 0 0; padding: 28px 24px; text-align: center; margin: -24px -24px 0 -24px;">
          <h1 style="margin: 0 0 8px; color: white; font-size: 22px; font-weight: 700;">Request Status Updated</h1>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Request <strong style="color: white;">${requestId}</strong> status changed</p>
        </div>
        
        <p style="margin: 24px 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Your figure request <strong>${requestId}</strong> status has been updated:</p>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin: 24px 0; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; flex-wrap: wrap;">
          <span style="font-size: 14px; color: #6b7280; line-height: 1;">From:</span>
          <span style="font-weight: 600; color: #374151; font-size: 15px; line-height: 1;">${oldStatusLabel}</span>
          <span style="color: ${statusColor}; font-size: 20px; font-weight: 700; line-height: 1; display: inline-flex; align-items: center;">→</span>
          <span style="font-weight: 700; color: ${statusColor}; font-size: 15px; line-height: 1;">${statusLabel}</span>
        </div>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 24px 0;">
          ${figureName ? `<p style="margin: 0 0 8px; color: #1f2937; font-size: 15px;"><strong>Figure:</strong> ${figureName}</p>` : ""}
          ${series ? `<p style="margin: 0 0 8px; color: #1f2937; font-size: 15px;"><strong>Series:</strong> ${series}</p>` : ""}
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Request ID: <strong>${requestId}</strong></p>
        </div>
        
        <p style="margin-top: 24px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/requests/${requestId}" style="display: inline-block; color: #6366f1; font-weight: 600; text-decoration: none; font-size: 14px;">Track your request →</a>
        </p>
      `,
    }),
  })
}