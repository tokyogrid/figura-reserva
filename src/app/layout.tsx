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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <CartProvider>
          <AuthProvider>
            <ToasterProvider>
              <CSRFInit />
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>{siteConfig.footer.copyright}</p>
                  <p className="mt-1">{siteConfig.footer.disclaimer}</p>
                </div>
              </footer>
              <CartDrawer />
            </ToasterProvider>
          </AuthProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}