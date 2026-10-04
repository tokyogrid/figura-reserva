import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { CatalogContent } from "./CatalogContent"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `${siteConfig.catalog.title} - ${siteConfig.name}`,
  description: siteConfig.catalog.subtitle,
}

export default async function CatalogPage() {
  return <CatalogContent />
}