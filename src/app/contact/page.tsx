import { Metadata } from "next"
import ContactClient from "./ContactClient"

export const metadata: Metadata = {
  title: "Contactar - Tokyo Grid",
  description: "¿Necesitas ayuda? Contacta con nuestro equipo de soporte. Respondemos en 24-48h.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    url: "/contact",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactPage() {
  return <ContactClient />
}