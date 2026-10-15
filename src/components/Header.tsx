"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { ShoppingCart, User, LogOut, Package, Menu, X, ChevronDown, MessageSquare, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

export function Header() {
  const { totalItems, totalPrice, setIsOpen } = useCart()
  const { user, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`

  useEffect(() => {
    setMounted(true)
  }, [])

  const MobileMenu = () => {
    if (!mobileMenuOpen || !mounted) return null

    return createPortal(
      <div id="mobile-menu" className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <Image
              src="/images/logo.png"
              alt="Tokyo Grid Logo"
              width={40}
              height={40}
              className="h-10 w-10"
              quality={100}
              priority
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Tokyo Grid</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="space-y-4">
          <Link href="/catalog" className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Catalog
          </Link>
          <Link href="/request" className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Request Figure
          </Link>
          <Link href="/vinted" className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Our Vinted
          </Link>
          <Link href="/how-it-works" className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            How It Works
          </Link>
          <Link href="/contact" className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3">
            <Mail className="h-5 w-5" />
            Contact Support
          </Link>

          {user ? (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
              <Link
                href="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3"
              >
                <Package className="h-5 w-5" />
                My Orders
              </Link>
              <Link
                href="/account/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3"
              >
                <MessageSquare className="h-5 w-5" />
                My Requests
              </Link>
              <Link
                href="/account/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3"
              >
                <User className="h-5 w-5" />
                Edit Profile
              </Link>
              <button
                onClick={async () => {
                  await logout()
                  setMobileMenuOpen(false)
                  window.location.href = "/"
                }}
                className="w-full text-left py-3 text-lg font-medium text-red-600 dark:text-red-400 flex items-center gap-3"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <Link 
                href="/login?callbackUrl=/request"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
              <Link 
                href="/login?register=true&callbackUrl=/request"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Create Account
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="relative w-full"
              onClick={() => setIsOpen(true)}
              aria-label={`Cart: ${totalItems} items, ${formatPrice(totalPrice)}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                {formatPrice(totalPrice)}
              </span>
              {totalItems > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold",
                  totalItems > 99 && "w-auto px-1.5"
                )} aria-label={`${totalItems} items`}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
          </div>
        </nav>
      </div>,
      document.body
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-950/80">
      <nav className="container">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Tokyo Grid - Home">
            <Image
              src="/images/logo.png"
              alt="Tokyo Grid Logo"
              width={50}
              height={50}
              className="h-13 w-13"
              quality={100}
              priority
            />
            <span className="font-bold text-xl text-gray-900 dark:text-white">Tokyo Grid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link href="/catalog" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Catalog
            </Link>
            <Link href="/request" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Request Figure
            </Link>
            <Link href="/vinted" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Our Vinted
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Auth Section - Desktop */}
            <div className="hidden md:flex md:items-center md:gap-4">
              {/* User is authenticated - show user menu */}
              {user && (
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 rounded-lg px-3 py-2">
                        <Avatar className="h-13 w-13">
                          <AvatarImage src="/api/avatar" alt="User" />
                          <AvatarFallback>{user.name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block font-medium text-gray-700 dark:text-gray-300">{user.name || "Account"}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white cursor-default">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link href="/account/orders" className="block">
                        <DropdownMenuItem className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                          <Package className="h-4 w-4 mr-2 inline" />
                          My Orders
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/account/requests" className="block">
                        <DropdownMenuItem className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                          <MessageSquare className="h-4 w-4 mr-2 inline" />
                          My Requests
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/account/profile" className="block">
                        <DropdownMenuItem className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                          <User className="h-4 w-4 mr-2 inline" />
                          Edit Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          await logout()
                          window.location.href = "/"
                        }}
                        className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2 inline" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {!user && (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login?callbackUrl=/request"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register?callbackUrl=/request"
                    className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Button - Desktop only */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex relative"
              onClick={() => setIsOpen(true)}
              aria-label={`Cart: ${totalItems} items, ${formatPrice(totalPrice)}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                {formatPrice(totalPrice)}
              </span>
              {totalItems > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold",
                  totalItems > 99 && "w-auto px-1.5"
                )} aria-label={`${totalItems} items`}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Cart Button - Mobile only (button in header) */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden relative"
          onClick={() => setIsOpen(true)}
          aria-label={`Cart: ${totalItems} items, ${formatPrice(totalPrice)}`}
        >
          <ShoppingCart className="h-6 w-6" aria-hidden="true" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </nav>
    </header>
  )
}