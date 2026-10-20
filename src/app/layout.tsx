import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/AuthContext"
import { Header } from "@/components/Header"
import { CartDrawer } from "@/components/CartDrawer"
import { ToasterProvider } from "@/components/ui/Toaster"
import { CSRFInit } from "@/components/CSRFInit"
import { siteConfig } from "@/lib/site-config"
import { Analytics } from "@vercel/analytics/next"
import { TrustpilotBadgeWrapper } from "@/components/TrustpilotBadgeWrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL("https://tokyogridstore.com"),
  title: "Tokyo Grid Store | Figuras de Anime Originales de Japón",
  description: "Tienda de figuras oficiales e importaciones exclusivas traídas directamente desde Tokio. Ediciones limitadas, envíos garantizados y embalaje hiperprotegido.",
  keywords: ["figuras anime", "tokyo grid store", "figuras japon", "importacion anime", "akihabara figures"],
  authors: [{ name: "Tokyo Grid Store" }],
  creator: "Tokyo Grid Store",
  publisher: "Tokyo Grid Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://tokyogridstore.com",
  },
  openGraph: {
    title: "Tokyo Grid Store | Figuras de Anime Originales",
    description: "Importación directa de figuras oficiales desde Japón. Catálogo actualizado y envíos seguros.",
    url: "https://tokyogridstore.com",
    siteName: "Tokyo Grid Store",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        alt: "Tokyo Grid Store Logo",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Tokyo Grid Store | Figuras de Anime Originales",
    description: "Importación directa de figuras oficiales desde Japón.",
    images: ["/images/logo.png"],
    creator: "@tokyogridstore",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <CartProvider>
          <AuthProvider>
            <ToasterProvider>
              <CSRFInit />
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="text-center sm:text-left">
                      <p>{siteConfig.footer.copyright}</p>
                      <p className="mt-1">{siteConfig.footer.disclaimer}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <TrustpilotBadgeWrapper />
                    </div>
                  </div>
                </div>
              </footer>
              <CartDrawer />
              <Analytics />
            </ToasterProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}