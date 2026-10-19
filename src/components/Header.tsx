"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/DropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { ShoppingCart, User, LogOut, Package, Menu, X, ChevronDown, MessageSquare, Mail, Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

export function Header() {
  const { totalItems, totalPrice, setIsOpen } = useCart()
  const { user, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const MobileMenu = () => {
    if (!mobileMenuOpen || !mounted) return null

    return createPortal(
      <div id="mobile-menu" className="fixed inset-0 z-[9999] bg-gray-950/95 backdrop-blur-xl p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="relative p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Image
                src="/images/logo.png"
                alt="Tokyo Grid Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg"
                quality={100}
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">Tokyo Grid</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="space-y-3">
          <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            Catalog
          </Link>
          <Link href="/request" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            Request Figure
          </Link>
          <Link href="/vinted" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            Our Vinted
          </Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            How It Works
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">
            <Mail className="h-5 w-5" />
            Contact Support
          </Link>

          {user ? (
            <div className="pt-4 border-t border-gray-800 space-y-3">
              <div className="px-3 py-2 text-sm text-gray-500">
                {user.email}
              </div>
              <Link
                href="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
              >
                <Package className="h-5 w-5" />
                My Orders
              </Link>
              <Link
                href="/account/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
              >
                <MessageSquare className="h-5 w-5" />
                My Requests
              </Link>
              <Link
                href="/account/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
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
                className="w-full text-left py-3 text-lg font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-800 space-y-3">
              <Link 
                href="/login?callbackUrl=/request"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login?register=true&callbackUrl=/request"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all shadow-lg shadow-purple-500/25"
              >
                <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                Create Account
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              className="relative w-full bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 transition-all"
              onClick={() => setIsOpen(true)}
              aria-label={`Cart: ${totalItems} items, ${formatPrice(totalPrice)}`}
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="ml-1 font-medium text-gray-300">
                {formatPrice(totalPrice)}
              </span>
              {totalItems > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold",
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
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      scrolled 
        ? "bg-gray-950/95 backdrop-blur-xl border-gray-800/50" 
        : "bg-gray-950/60 backdrop-blur-xl border-gray-800/30"
    )}>
      <nav className="container">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Tokyo Grid - Home">
            <div className="relative p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Image
                src="/images/logo.png"
                alt="Tokyo Grid Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg"
                quality={100}
                priority
              />
            </div>
            <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Tokyo Grid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <Link href="/catalog" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              Catalog
            </Link>
            <Link href="/request" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              Request Figure
            </Link>
            <Link href="/vinted" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              Our Vinted
            </Link>
            <Link href="/how-it-works" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              How It Works
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Auth Section - Desktop */}
            <div className="hidden md:flex md:items-center md:gap-3">
              {/* User is authenticated - show user menu */}
              {user && (
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/api/avatar" alt="User" />
                          <AvatarFallback>{user.name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block font-medium text-white">{user.name || "Account"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 rounded-xl p-2 shadow-2xl" align="end" forceMount>
                      <DropdownMenuItem className="px-3 py-2 text-sm font-medium text-white cursor-default">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <Link href="/account/orders" className="block">
                        <DropdownMenuItem className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                          <Package className="h-4 w-4 mr-2 inline" />
                          My Orders
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/account/requests" className="block">
                        <DropdownMenuItem className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                          <MessageSquare className="h-4 w-4 mr-2 inline" />
                          My Requests
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/account/profile" className="block">
                        <DropdownMenuItem className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer">
                          <User className="h-4 w-4 mr-2 inline" />
                          Edit Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        onClick={async () => {
                          await logout()
                          window.location.href = "/"
                        }}
                        className="px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
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
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register?callbackUrl=/request"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg shadow-purple-500/25"
                  >
                    <Sparkles className="h-4 w-4 mr-1" aria-hidden="true" />
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Button - Desktop only (with price) */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex relative bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 transition-all duration-200 border border-white/10"
              onClick={() => setIsOpen(true)}
              aria-label={`Cart: ${totalItems} items, ${formatPrice(totalPrice)}`}
            >
              <ShoppingCart className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="ml-2 font-semibold text-white">
                {formatPrice(totalPrice)}
              </span>
              {totalItems > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold",
                  totalItems > 99 && "w-auto px-1.5"
                )} aria-label={`${totalItems} items`}>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6 text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Portal */}
        <MobileMenu />
      </nav>
    </header>
  )
}