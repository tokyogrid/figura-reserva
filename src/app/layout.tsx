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
import { Instagram, Youtube, Music } from "lucide-react"

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
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <a href="https://www.instagram.com/tokyogridstore/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="Instagram">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="https://www.tiktok.com/@tokyogridstore?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="TikTok">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.545.091a12.5 12.5 0 0 1 4.385.514 12.7 12.7 0 0 1 3.527 4.272c.66 1.195.815 2.538.413 3.815a12.666 12.666 0 0 1-3.445 4.52c-.54.514-1.139.98-1.76 1.44a6.624 6.624 0 0 1-.69.8c-.145.174-.3.35-.46.53a12.124 12.124 0 0 1-1.67 2.17c-.34.415-.67.83-1.176 1.045a.85.85 0 0 1-.59.07 21.8 21.8 0 0 1-1.58-.38c-.33-.12-.66-.25-1.145-.22-.48.03-.805.28-1.28.505a15.4 15.4 0 0 1-2.193.86c-.735.16-1.485.22-2.26.07a12.6 12.6 0 0 1-3.528-4.185 12.53 12.53 0 0 1-.28-4.506c0-.95.22-1.886.62-2.715a12.454 12.454 0 0 1 4.658-4.887c.935-.59 1.947-.9 3.02-.9h.01a12.73 12.73 0 0 1 2.045.2c.66.14 1.32.33 1.87.56.2.09.46.15.7.21.4.1.81.14 1.2.16.28.01.48-.08.87-.3.48-.26.73-.72.98-1.16l.1-.2c.16-.3.3-.59.52-.87.23-.29.43-.58.73-.8.15-.1.3-.18.54-.18h.02c.31 0 .57.07.92.19a6.05 6.05 0 0 1 1.37.63 8.3 8.3 0 0 1 1.22.9c.44.34.79.75 1.13 1.2.47.63.82 1.3.97 2.1.03.17.04.43-.06.59-.06.1-.15.17-.23.25-.09.09-.25.2-.34.28-.25.2-.47.38-.76.52-.22.1-.4.2-.7.2a5.5 5.5 0 0 1-.5-.12c-.18-.07-.33-.18-.53-.27-.4-.19-.68-.45-.98-.7-.25-.2-.54-.33-.77-.54-.31-.27-.5-.6-.7-.92a3.4 3.4 0 0 1-.48-1.24 3.26 3.26 0 0 1-.18-1.4 2.8 2.8 0 0 1 .16-1.2c.16-.36.4-.66.7-.92a8 8 0 0 1 1.67-1.56 9 9 0 0 1 3-.14c1.27 0 2.34.42 3.2 1.08" />
                        </svg>
                      </a>
                      <a href="https://www.youtube.com/@tokyogridstore" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="YouTube">
                        <Youtube className="h-5 w-5" />
                      </a>
                    </div>
                    <div className="text-center sm:text-left">
                      <p>{siteConfig.footer.copyright}</p>
                      <p className="mt-1">{siteConfig.footer.disclaimer}</p>
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