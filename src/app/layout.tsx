import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/AuthContext";
import { ToasterProvider } from "@/components/ui/Toaster";
import { CSRFInit } from "@/components/CSRFInit";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <CartProvider>
          <AuthProvider>
            <ToasterProvider>
              <CSRFInit />
              {children}
            </ToasterProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}