"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toaster"
import { formatPrice, cn } from "@/lib/utils"
import { Truck, Shield, CreditCard, Loader2, MapPin, Mail, Phone, User, Home, Package } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Label } from "@/components/ui/Label"
import { loadStripe } from "@stripe/stripe-js"
import { siteConfig } from "@/lib/site-config"
import { useCSRF } from "@/hooks/useCSRF"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items, totalPrice, discount, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [purchaseOption, setPurchaseOption] = useState<"direct" | "other">("direct")
  const [step, setStep] = useState("form")
  
  // Shipping: 5€ for orders under 100€, free above
  const shippingCost = totalPrice > 0 && totalPrice < 10000 ? 500 : 0
  const freeShippingThreshold = 10000
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
  
  // Calculate discount amount (discount.value is percentage * 100 in DB, e.g., 15% = 1500)
  const discountAmount = discount ? (discount.type === "percentage" 
    ? Math.round(totalPrice * (discount.value / 100) / 100)  // e.g., 10000 * 1500 / 10000 = 1500 cents = €15
    : Math.min(discount.value, totalPrice)) : 0
  
  const subtotal = totalPrice
  const total = subtotal - discountAmount + shippingCost

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "ES",
    notes: "",
    discountCode: discount?.code || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-fill form when user selects "direct" (Ship to My Address)
  useEffect(() => {
    if (purchaseOption === "direct" && user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.name || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        country: user.country || "ES",
      }))
    }
  }, [purchaseOption, user])

  // Auto-fill discount from cart
  useEffect(() => {
    if (discount?.code) {
      setFormData((prev) => ({
        ...prev,
        discountCode: discount.code,
      }))
    }
  }, [discount])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.customerName.trim()) newErrors.customerName = "Full name required"
    if (!formData.email.trim()) newErrors.email = "Email required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    
    // Address validation for both options now
    if (!formData.address.trim()) newErrors.address = "Address required"
    if (!formData.city.trim()) newErrors.city = "City required"
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code required"
    else if (!/^\d{5}$/.test(formData.postalCode)) newErrors.postalCode = "Invalid postal code (5 digits)"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { fetchWithCSRF } = useCSRF()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || items.length === 0) return

    setLoading(true)
    try {
      const { discountCode, ...formDataWithoutDiscount } = formData
      const res = await fetchWithCSRF("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ 
          items, 
          shippingCost, 
          total, 
          purchaseOption, 
          discountCode: formData.discountCode, 
          ...formDataWithoutDiscount 
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error creating checkout session")

      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe not loaded")

      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
      if (error) throw error
    } catch (error: any) {
      toast({ type: "error", title: "Error", message: error.message })
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center py-12">
        <div className="container max-w-md text-center p-8">
          <User className="h-16 w-16 mx-auto text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{siteConfig.checkout.title || "Please Sign In"}</h1>
          <p className="text-gray-400 mb-6">You must be logged in to proceed to checkout.</p>
          <Button variant="primary" className="w-full" onClick={() => router.push("/login?callbackUrl=/checkout")}>
            Sign In to Continue
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8">
          <svg className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <h1 className="text-2xl font-bold text-white mb-2">{siteConfig.checkout.emptyCart}</h1>
          <p className="text-gray-400 mb-6">{siteConfig.checkout.emptyCartDesc}</p>
          <Button onClick={() => router.push("/catalog")} variant="primary">
            {siteConfig.checkout.browseCatalog}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-8">
      <div className="container">
        {/* Progress steps */}
        <div className="hidden md:flex items-center justify-center mb-8 animate-fade-in">
          {["form", "payment", "success"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                step === s || (s === "payment" && step === "success")
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : s === "form"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gray-800/50 text-gray-500 border border-gray-700/50"
              )}>
                {i + 1}
              </div>
              {i < 2 && <div className={cn("w-24 h-1 mx-2", step !== "form" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-800/50")} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Purchase Option Selection */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{siteConfig.checkout.purchaseOptions.title}</h2>
                  <p className="text-sm text-gray-400">Choose how you'd like to receive your figure</p>
                </div>
              </div>
              <div className="space-y-3">
                <RadioGroup onValueChange={(v) => setPurchaseOption(v as "direct" | "other")} value={purchaseOption} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="direct"
                      checked={purchaseOption === "direct"}
                      onChange={() => setPurchaseOption("direct")}
                      className="h-4 w-4 appearance-none border-2 border-purple-500 checked:bg-purple-600 rounded-full transition-colors"
                      id="direct"
                    />
                    <label htmlFor="direct" className="flex flex-col cursor-pointer flex-1">
                      <span className="font-medium text-white flex items-center gap-2">
                        <Home className="h-4 w-4" aria-hidden="true" />
                        {siteConfig.checkout.purchaseOptions.direct.label}
                      </span>
                      <span className="text-sm text-gray-400">{siteConfig.checkout.purchaseOptions.direct.description}</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="other"
                      checked={purchaseOption === "other"}
                      onChange={() => setPurchaseOption("other")}
                      className="h-4 w-4 appearance-none border-2 border-purple-500 checked:bg-purple-600 rounded-full transition-colors"
                      id="other"
                    />
                    <label htmlFor="other" className="flex flex-col cursor-pointer flex-1">
                      <span className="font-medium text-white flex items-center gap-2">
                        <Package className="h-4 w-4" aria-hidden="true" />
                        {siteConfig.checkout.purchaseOptions.vinted.label}
                      </span>
                      <span className="text-sm text-gray-400">{siteConfig.checkout.purchaseOptions.vinted.description}</span>
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Shipping Form */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{siteConfig.checkout.shippingInfo}</h3>
                  <p className="text-sm text-gray-400">We'll ship your figures safely to this address</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label={siteConfig.checkout.name + " *"}
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    error={errors.customerName}
                    placeholder="John Smith"
                    required
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <Input
                    label={siteConfig.checkout.email + " *"}
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    placeholder="john@email.com"
                    required
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <Input
                  label={siteConfig.checkout.phone}
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+34 600 000 000"
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
                <Input
                  label={siteConfig.checkout.address + " *"}
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={errors.address}
                  placeholder="123 Main St, Apt 4B"
                  required
                  className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    label={siteConfig.checkout.city + " *"}
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    error={errors.city}
                    placeholder="Madrid"
                    required
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <Input
                    label={siteConfig.checkout.postalCode + " *"}
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    error={errors.postalCode}
                    placeholder="28001"
                    required
                    maxLength={5}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <Input
                    label={siteConfig.checkout.country}
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    disabled
                    className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1.5">
                    {siteConfig.checkout.notes + " " + siteConfig.common.optional}
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={siteConfig.checkout.notesPlaceholder}
                    rows={3}
                    className="w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Discount Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                    <span>Discount Code</span>
                    {discount && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {discount.type === "percentage" ? `${discount.value / 100}%` : `${formatPrice(discount.value)}`} applied
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="discountCode"
                      value={formData.discountCode || ""}
                      onChange={(e) => setFormData({ ...formData, discountCode: e.target.value.toUpperCase() })}
                      placeholder="DISCOUNT20"
                      className="w-full px-3 py-2 pl-10 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                      disabled={!!discount}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 17h10m-10-5v10M7 7l10 10" />
                      </svg>
                    </span>
                  </div>
                  {discount && (
                    <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                      Discount <strong>{discount.code}</strong> applied - {discount.type === "percentage" ? `${discount.value / 100}%` : formatPrice(discount.value)} off products
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                  variant="primary"
                >
                  {siteConfig.checkout.continueToPayment}
                </Button>
              </form>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/20 text-blue-400 mb-2">
                <Shield className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-medium text-white">{siteConfig.checkout.secure}</p>
              <p className="text-xs text-gray-500">{siteConfig.checkout.paymentMethods}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400 mb-2">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-medium text-white">{siteConfig.checkout.shipping}</p>
              <p className="text-xs text-gray-500">Certified mail with tracking & insurance</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <p className="font-medium text-white">Protection</p>
              <p className="text-xs text-gray-500">Auto-refund if we can't get it</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div>
        <div className="sticky top-24 bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white">{siteConfig.checkout.orderSummary}</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-900">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800/50 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{siteConfig.checkout.subtotal} ({items.reduce((s, i) => s + i.quantity, 0)} {siteConfig.checkout.items})</span>
                <span className="font-medium text-white">{formatPrice(subtotal)}</span>
              </div>
              
              {discount && (
                <div className="flex justify-between text-sm text-green-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 17h10m-10-5v10M7 7l10 10" />
                    </svg>
                    Discount ({discount.code})
                  </span>
                  <span className="font-medium">- {formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.checkout.shipping}
                </span>
                <span className="font-medium text-white">
                  {shippingCost === 0 ? (
                    <span className="text-green-400">{siteConfig.checkout.free}</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {subtotal > 0 && subtotal < freeShippingThreshold && (
                <p className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 p-2 rounded-xl">
                  {siteConfig.checkout.addForFreeShipping.replace('{amount}', formatPrice(freeShippingThreshold - subtotal))}
                </p>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-800/50 pt-3">
                <span className="text-white">{siteConfig.checkout.total}</span>
                <span className="text-white drop-shadow-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/50 space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                {siteConfig.checkout.paymentMethods}
              </p>
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4" aria-hidden="true" />
                {siteConfig.checkout.secure}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {siteConfig.checkout.confirmation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}