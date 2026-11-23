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
import { TrustpilotBadge } from "@/components/TrustpilotBadge"

import { SITE_URL } from "@/lib/utils"
import { Instagram, Youtube } from "lucide-react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  openGraph: {
    title: "Tokyo Grid Store | Figuras de Anime Originales",
    description: "Importación directa de figuras oficiales desde Japón. Catálogo actualizado y envíos seguros.",
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center sm:justify-start gap-6">
                      <a
                        href="https://www.instagram.com/tokyogridstore/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-9 w-9" />
                      </a>
                      <a
                        href="https://www.tiktok.com/@tokyogridstore?is_from_webapp=1&sender_device=pc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                        aria-label="TikTok"
                      >
                        <svg
                          className="h-9 w-9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M10 13a2.5 2.5 0 1 0 2.5 2.5V6.5a3.5 3.5 0 0 0 3.5 3.5" />
                        </svg>
                      </a>
                      <a
                        href="https://www.youtube.com/@tokyogridstore"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                        aria-label="YouTube"
                      >
                        <Youtube className="h-9 w-9" />
                      </a>
                      <a
                        href="https://x.com/tokyogridstore"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                        aria-label="X (Twitter)"
                      >
                        <svg
                          className="h-9 w-9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <g transform="translate(5.5, 5.5) scale(0.54)" fill="currentColor" stroke="none">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </g>
                        </svg>
                      </a>
                    </div>

                    <div className="text-center">
                      <p>{siteConfig.footer.copyright}</p>
                      <p className="mt-1">{siteConfig.footer.disclaimer}</p>
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
                        <a href="/aviso-legal" className="hover:text-purple-400 transition-colors">Aviso Legal</a>
                        <span>•</span>
                        <a href="/politica-privacidad" className="hover:text-purple-400 transition-colors">Política de Privacidad</a>
                        <span>•</span>
                        <a href="/terminos-y-condiciones" className="hover:text-purple-400 transition-colors">Términos y Condiciones</a>
                        <span>•</span>
                        <a href="/cookies" className="hover:text-purple-400 transition-colors">Política de Cookies</a>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <TrustpilotBadge />
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