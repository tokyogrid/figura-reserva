import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { CatalogContent } from "./CatalogContent"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `${siteConfig.catalog.title} - ${siteConfig.name}`,
  description: siteConfig.catalog.subtitle,
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    url: "/catalog",
    locale: "es_ES",
    type: "website",
  },
}

export default async function CatalogPage() {
  return <CatalogContent />
}