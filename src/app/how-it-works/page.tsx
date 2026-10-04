import { Metadata } from "next"
import { HowItWorksContent } from "./HowItWorksContent"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `${siteConfig.howItWorks.title} - ${siteConfig.name}`,
  description: siteConfig.howItWorks.subtitle,
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}