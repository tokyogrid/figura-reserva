import { Resend } from "resend"
import { getContactEmail, getReplyToEmail, SITE_URL } from "@/lib/utils"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Tokyo Grid <noreply@tokyogridstore.com>"
const SUPPORT_EMAIL = getContactEmail()
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || getContactEmail() || "tokyogridstore@gmail.com"
const APP_URL = SITE_URL
// Use a publicly accessible logo URL for emails (localhost won't work in email clients)
// In production, set NEXT_PUBLIC_LOGO_URL to your CDN/logo URL
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || `${APP_URL}/images/logo.png`
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Email template wrapper with logo and consistent styling
function emailTemplate({ title, preheader, children, footerText = "Tokyo Grid - Importación de figuras de anime desde Japón" }: {
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
      <title>${title}</title>
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
              <a href="mailto:${SUPPORT_EMAIL}" style="color: #6366f1; text-decoration: none;">Contact Support</a>
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
    console.warn("Telegram no configurado - se omite la notificación")
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
    subject: `Solicitud recibida - ${requestId}`,
    html: emailTemplate({
      title: "Solicitud recibida",
      preheader: "Hemos recibido tu solicitud de figura y nuestro equipo la está revisando",
      children: `
        <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">Solicitud recibida</h1>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hola ${name},</p>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hemos recibido tu solicitud de figura. Nuestro equipo la revisará y te contactará si la encontramos.</p>
        <div style="background: #f0f4f8; border: 1px solid #d1d9e6; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Tu ID de solicitud</p>
          <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: 700; font-family: monospace;">${requestId}</p>
        </div>
        <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">Te enviaremos un email si encontramos la figura que buscas.</p>
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
    if (!min && !max) return "No especificado"
    if (min && max) return `€${(min/100).toFixed(0)} - €${(max/100).toFixed(0)}`
    if (min) return `Desde €${(min/100).toFixed(0)}`
    if (max) return `Hasta €${(max/100).toFixed(0)}`
    return "No especificado"
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Nueva solicitud de figura: ${requestId}`,
    html: emailTemplate({
      title: "Nueva solicitud de figura",
      preheader: `Nueva solicitud de ${name} (${email})`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">Nueva solicitud de figura</h1>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">ID Solicitud</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${requestId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cliente</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name} (${email})</td>
            </tr>
            ${series ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Serie</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${series}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Figura</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${character}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Presupuesto</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${formatBudget(budgetMin, budgetMax)}</td>
            </tr>
          </table>
        </div>
        ${button({ text: "Ver en Admin", url: `${APP_URL}/admin/requests/${requestId}`, color: "#6366f1" })}
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
    subject: `Confirmación de pedido - ${orderId}`,
    html: emailTemplate({
      title: "Pedido confirmado",
      preheader: `Tu pedido ${orderId} ha sido confirmado - Total: ${formatPrice(total)}`,
      children: `
        <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">¡Pedido confirmado!</h1>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hola ${customerName},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">¡Gracias por tu pedido! Tu pago se ha procesado correctamente.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="color: #166534; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; padding-bottom: 8px;">ID Pedido</td>
              <td style="text-align: right; color: #1f2937; font-size: 16px; font-weight: 700; font-family: monospace; padding-bottom: 8px;">${orderId}</td>
            </tr>
            <tr>
              <td style="color: #166534; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; border-top: 1px solid #dcfce7; padding-top: 8px;">Total pagado</td>
              <td style="text-align: right; color: #166534; font-size: 22px; font-weight: 700; border-top: 1px solid #dcfce7; padding-top: 8px;">${formatPrice(total)}</td>
            </tr>
          </table>
        </div>

        <h2 style="margin: 32px 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Artículos del pedido</h2>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="text-align: left; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Artículo</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Cant.</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Precio</th>
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

        <p style="margin-top: 32px; color: #374151; font-size: 15px; line-height: 1.6;">Te avisaremos por email en cada paso del proceso. ¿Dudas? Responde a este email.</p>
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
    subject: `Nuevo pedido: ${orderId}`,
    html: emailTemplate({
      title: "Nuevo pedido recibido",
      preheader: `${purchaseOption === "vinted" ? "Venta Vinted" : "Envío directo"} - ${formatPrice(total)}`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">Nuevo pedido recibido</h1>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">ID Pedido</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cliente</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${customerName} (${email})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Tipo</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${purchaseOption === "vinted" ? "Venta Vinted" : "Envío directo"}</td>
            </tr>
          </table>
        </div>

        <h2 style="margin: 32px 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Artículos del pedido</h2>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="text-align: left; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Artículo</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Cant.</th>
                <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Precio</th>
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

        ${button({ text: "Ver en Admin", url: `${APP_URL}/admin/orders/${orderId}`, color: "#6366f1" })}
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
    to: ADMIN_EMAIL,
    subject: `⚠️ Pago fallido: ${orderId}`,
    html: emailTemplate({
      title: "Pago fallido",
      preheader: `Pedido ${orderId} - Pago fallido, stock liberado`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 16px; color: #dc2626; font-size: 24px; font-weight: 700;">⚠️ Pago fallido</h1>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">ID Pedido</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cliente</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${customerName} (${email})</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">El pago de este pedido ha fallado. El stock ha sido liberado.</p>
        ${button({ text: "Ver en Admin", url: `${APP_URL}/admin/orders/${orderId}`, color: "#dc2626" })}
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
    to: ADMIN_EMAIL,
    subject: `❌ Pedido cancelado: ${orderId}`,
    html: emailTemplate({
      title: "Pedido cancelado",
      preheader: `Pedido ${orderId} - Cancelado (sesión expirada), stock liberado`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 16px; color: #dc2626; font-size: 24px; font-weight: 700;">❌ Pedido cancelado</h1>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">ID Pedido</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cliente</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${customerName} (${email})</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">El pedido se canceló (sesión expirada). El stock ha sido liberado.</p>
        ${button({ text: "Ver en Admin", url: `${APP_URL}/admin/orders/${orderId}`, color: "#dc2626" })}
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
    subject: "Verifica tu cuenta Tokyo Grid",
    html: emailTemplate({
      title: "¡Bienvenido a Tokyo Grid!",
      preheader: "Usa este código para verificar tu dirección de email",
      children: `
        <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">¡Bienvenido a Tokyo Grid!</h1>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hola ${name},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Gracias por crear una cuenta. Por favor usa el siguiente código de verificación para completar tu registro:</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; font-size: 36px; font-weight: 800; letter-spacing: 12px; padding: 20px 36px; border-radius: 12px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
            ${code}
          </div>
        </div>
        
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Este código expira en <strong>15 minutos</strong>.</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Si no has creado una cuenta, ignora este email.</p>
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
    subject: `Contacto: ${subject}`,
    html: emailTemplate({
      title: "Nuevo mensaje de contacto",
      preheader: `Mensaje de ${name} (${email})`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">Nuevo mensaje de contacto</h1>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Nombre</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Asunto</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${subject}</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 8px; color: #374151; font-size: 14px; font-weight: 600;">Mensaje:</p>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; white-space: pre-wrap; color: #374151; font-size: 15px; line-height: 1.7;">
          ${message}
        </div>
      `,
    }),
  })
}

// Send support ticket email to contact email
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
    forgot_password: "Contraseña olvidada",
    account_help: "Ayuda con la cuenta",
    order_issue: "Problema con pedido",
    other: "Otro",
  }
  const subjectLabel = subjectLabels[subject] || subject

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[Ticket ${ticketId}] ${subjectLabel}`,
    html: emailTemplate({
      title: "Nuevo ticket de soporte",
      preheader: `Ticket #${ticketId} - ${subjectLabel} de ${name}`,
      footerText: "Tokyo Grid Admin",
      children: `
        <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 24px; font-weight: 700;">Nuevo ticket de soporte</h1>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Ticket ID</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; font-family: monospace;">${ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Nombre</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Asunto</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${subjectLabel}</td>
            </tr>
          </table>
        </div>
        <p style="margin: 0 0 8px; color: #374151; font-size: 14px; font-weight: 600;">Mensaje:</p>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; white-space: pre-wrap; color: #374151; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          ${message}
        </div>
        ${button({ text: "Ver en Admin", url: `${APP_URL}/admin/tickets/${ticketId}`, color: "#6366f1" })}
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
    forgot_password: "Contraseña olvidada",
    account_help: "Ayuda con la cuenta",
    order_issue: "Problema con pedido",
    other: "Otro",
  }
  const subjectLabel = subjectLabels[subject] || subject

  const text = [
    "🎫 <b>Nuevo ticket de soporte</b>",
    `<b>Ticket ID:</b> <code>${ticketId}</code>`,
    `<b>Nombre:</b> ${name}`,
    `<b>Email:</b> ${email}`,
    `<b>Asunto:</b> ${subjectLabel}`,
    `<b>Mensaje:</b> ${message}`,
    "",
    `<a href="${APP_URL}/admin/tickets/${ticketId}">Ver en Admin</a>`,
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
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    PURCHASING_IN_JAPAN: "Comprando en Japón",
    AVAILABLE_ON_VINTED: "Disponible en Vinted",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
    PURCHASING_VINTED: "Comprando (Vinted)",
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

  const statusColor = statusColors[newStatus] || "#6b7280"
  const statusLabel = statusLabels[newStatus] || newStatus
  const oldStatusLabel = statusLabels[oldStatus] || oldStatus

  const itemsHtml = `
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="text-align: left; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Artículo</th>
            <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Cant.</th>
            <th style="text-align: right; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Precio</th>
            <th style="text-align: center; padding: 14px 16px; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb;">Tipo</th>
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
      <p style="margin: 0 0 8px; color: #7c3aed; font-size: 14px; font-weight: 600;">Código de pedido Vinted</p>
      <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: 600; color: #5b21b6;">${vintedCode}</p>
      <p style="margin: 12px 0 0; font-size: 13px; color: #6b7280;">Guarda este código para rastrear tu compra en Vinted. Completarás la compra en Vinted cuando el artículo se liste.</p>
    </div>
  ` : ""

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Actualización de pedido - ${orderId} - ${statusLabel}`,
    html: emailTemplate({
      title: "Estado de pedido actualizado",
      preheader: `Tu pedido ${orderId} ahora está ${statusLabel}`,
      children: `
        <div style="background: ${statusColor}; border-radius: 12px 12px 0 0; padding: 28px 24px; text-align: center; margin: -24px -24px 0 -24px;">
          <h1 style="margin: 0 0 8px; color: white; font-size: 22px; font-weight: 700;">Estado de pedido actualizado</h1>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Pedido <strong style="color: white;">${orderId}</strong> cambio de estado</p>
        </div>
        
        <p style="margin: 24px 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hola ${customerName},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Tu pedido <strong>${orderId}</strong> ha cambiado de estado:</p>
        
        <div style="margin: 24px 0; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
          <span style="font-size: 14px; color: #6b7280;">De: </span>
          <span style="font-weight: 600; color: #374151; font-size: 15px;">${oldStatusLabel}</span>
          <span style="color: ${statusColor}; font-size: 20px; font-weight: 700; margin: 0 8px;">→</span>
          <span style="font-weight: 700; color: ${statusColor}; font-size: 15px;">${statusLabel}</span>
        </div>
        
        ${vintedInfo}
        
        <h3 style="margin: 32px 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Artículos del pedido</h3>
        ${itemsHtml}
        
        <p style="margin-top: 24px; text-align: center;">
          <a href="${APP_URL}/order/${orderId}" style="display: inline-block; color: #6366f1; font-weight: 600; text-decoration: none; font-size: 14px;">Rastrear tu pedido →</a>
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
    PENDING: "Pendiente",
    SEARCHING: "Buscando",
    FOUND: "Encontrada - Pendiente confirmación",
    PURCHASING: "Comprando",
    PURCHASED: "Comprada",
    SHIPPED: "Enviada",
    DELIVERED: "Entregada",
    CANCELLED: "Cancelada",
    UNAVAILABLE: "No disponible",
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
    subject: `Actualización de solicitud - ${requestId} - ${statusLabel}`,
    html: emailTemplate({
      title: "Estado de solicitud actualizado",
      preheader: `Tu solicitud de figura ${requestId} ahora está ${statusLabel}`,
      children: `
        <div style="background: ${statusColor}; border-radius: 12px 12px 0 0; padding: 28px 24px; text-align: center; margin: -24px -24px 0 -24px;">
          <h1 style="margin: 0 0 8px; color: white; font-size: 22px; font-weight: 700;">Estado de solicitud actualizado</h1>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Solicitud <strong style="color: white;">${requestId}</strong> cambio de estado</p>
        </div>
        
        <p style="margin: 24px 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">Hola ${name},</p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">Tu solicitud de figura <strong>${requestId}</strong> ha cambiado de estado:</p>
        
        <div style="margin: 24px 0; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
          <span style="font-size: 14px; color: #6b7280;">De: </span>
          <span style="font-weight: 600; color: #374151; font-size: 15px;">${oldStatusLabel}</span>
          <span style="color: ${statusColor}; font-size: 20px; font-weight: 700; margin: 0 8px;">→</span>
          <span style="font-weight: 700; color: ${statusColor}; font-size: 15px;">${statusLabel}</span>
        </div>
        
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 24px 0;">
          ${figureName ? `<p style="margin: 0 0 8px; color: #1f2937; font-size: 15px;"><strong>Figura:</strong> ${figureName}</p>` : ""}
          ${series ? `<p style="margin: 0 0 8px; color: #1f2937; font-size: 15px;"><strong>Serie:</strong> ${series}</p>` : ""}
          <p style="margin: 0; color: #6b7280; font-size: 14px;">ID Solicitud: <strong>${requestId}</strong></p>
        </div>
        
        <p style="margin-top: 24px; text-align: center;">
          <a href="${APP_URL}/account/requests/${requestId}" style="display: inline-block; color: #6366f1; font-weight: 600; text-decoration: none; font-size: 14px;">Rastrear tu solicitud →</a>
        </p>
      `,
    }),
  })
}