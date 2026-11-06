import { Metadata } from "next"
import HowItWorksClient from "./HowItWorksClient"

export const metadata: Metadata = {
  title: "Cómo Funciona - Tokyo Grid",
  description: "Descubre cómo reservar figuras de anime directamente desde Japón. Tú eliges, nosotros compramos, tú recibes.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    url: "/how-it-works",
    locale: "es_ES",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HowItWorksPage() {
  return <HowItWorksClient />
}