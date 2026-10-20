import { MetadataRoute } from "next"

const BASE_URL = "https://tokyogridstore.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/account/", "/checkout/", "/order/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}