import { Metadata } from "next"
import RequestClient from "./RequestClient"

export const metadata: Metadata = {
  title: "Solicitar Figura - Tokyo Grid",
  description: "No encuentras tu figura? Solicítala y buscaremos en nuestros proveedores de Japón. Si la encontramos, tienes prioridad para reservar.",
  alternates: {
    canonical: "/request",
  },
  openGraph: {
    url: "/request",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RequestPage() {
  return <RequestClient />
}