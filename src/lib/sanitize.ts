let DOMPurify: any = null

if (typeof window !== "undefined") {
  try {
    const createDOMPurify = require("dompurify")
    DOMPurify = createDOMPurify(window)
  } catch {
    DOMPurify = null
  }
}

function escapeHtml(html: string): string {
  return html
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;")
    .replace(/'/g, "\u0026#039;")
}

export function sanitizeHtml(html: string): string {
  try {
    if (DOMPurify) {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
        ALLOWED_ATTR: ["href", "target", "rel"],
      })
    }
    return escapeHtml(html)
  } catch (error) {
    console.error("sanitizeHtml error:", error)
    return escapeHtml(html)
  }
}