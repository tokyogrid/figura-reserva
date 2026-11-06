import { Metadata } from "next"
import VintedClient from "./VintedClient"

export const metadata: Metadata = {
  title: "Nuestro Vinted - Tokyo Grid",
  description: "Descubre nuestra tienda Vinted verificada. Figuras de anime originales con envío seguro desde España.",
  alternates: {
    canonical: "/vinted",
  },
  openGraph: {
    url: "/vinted",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function VintedPage() {
  return <VintedClient />
}