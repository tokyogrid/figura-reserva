"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toaster"
import { formatPrice, cn } from "@/lib/utils"
import { Truck, Shield, CreditCard, Loader2, MapPin, Mail, Phone, User } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Label } from "@/components/ui/Label"
import { loadStripe } from "@stripe/stripe-js"
import { siteConfig } from "@/lib/site-config"
import { useCSRF } from "@/hooks/useCSRF"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [purchaseOption, setPurchaseOption] = useState<"direct" | "vinted">("direct")
  const [step, setStep] = useState("form")
  const shippingCost = totalPrice > 0 && totalPrice < 10000 ? 499 : 0
  const total = totalPrice + shippingCost

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "ES",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.customerName.trim()) newErrors.customerName = "Full name required"
    if (!formData.email.trim()) newErrors.email = "Email required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (purchaseOption === "direct") {
      if (!formData.address.trim()) newErrors.address = "Address required"
      if (!formData.city.trim()) newErrors.city = "City required"
      if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code required"
      else if (!/^\d{5}$/.test(formData.postalCode)) newErrors.postalCode = "Invalid postal code (5 digits)"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { fetchWithCSRF } = useCSRF()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || items.length === 0) return

    setLoading(true)
    try {
      const res = await fetchWithCSRF("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ items, shippingCost, total, purchaseOption, ...formData }),
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center p-8">
          <svg className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{siteConfig.checkout.emptyCart}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{siteConfig.checkout.emptyCartDesc}</p>
          <Button onClick={() => router.push("/catalog")} variant="primary">
            {siteConfig.checkout.browseCatalog}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container">
        {/* Progress steps */}
        <div className="hidden md:flex items-center justify-center mb-8">
          {["form", "payment", "success"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                step === s || (s === "payment" && step === "success")
                  ? "bg-blue-600 text-white"
                  : s === "form"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              )}>
                {i + 1}
              </div>
              {i < 2 && <div className={cn("w-24 h-1 mx-2", step !== "form" ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700")} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Purchase Option Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" aria-hidden="true" />
                  {siteConfig.checkout.purchaseOptions.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup onValueChange={(v) => setPurchaseOption(v as "direct" | "vinted")} value={purchaseOption} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="direct" className="h-4 w-4" id="direct" />
                    <Label htmlFor="direct" className="flex flex-col cursor-pointer">
                      <span className="font-medium text-gray-900 dark:text-white">{siteConfig.checkout.purchaseOptions.direct.label}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{siteConfig.checkout.purchaseOptions.direct.description}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="vinted" className="h-4 w-4" id="vinted" />
                    <Label htmlFor="vinted" className="flex flex-col cursor-pointer">
                      <span className="font-medium text-gray-900 dark:text-white">{siteConfig.checkout.purchaseOptions.vinted.label}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{siteConfig.checkout.purchaseOptions.vinted.description}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Shipping Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" aria-hidden="true" />
                  {siteConfig.checkout.shippingInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label={siteConfig.checkout.name + " " + siteConfig.common.required}
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      error={errors.customerName}
                      placeholder="John Smith"
                      required
                    />
                    <Input
                      label={siteConfig.checkout.email + " " + siteConfig.common.required}
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      placeholder="john@email.com"
                      required
                    />
                  </div>
                  <Input
                    label={siteConfig.checkout.phone}
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                  />
                  {purchaseOption === "direct" && (
                    <>
                      <Input
                        label={siteConfig.checkout.address + " " + siteConfig.common.required}
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        error={errors.address}
                        placeholder="123 Main St, Apt 4B"
                        required
                      />
                      <div className="grid sm:grid-cols-3 gap-4">
                        <Input
                          label={siteConfig.checkout.city + " " + siteConfig.common.required}
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          error={errors.city}
                          placeholder="Madrid"
                          required
                        />
                        <Input
                          label={siteConfig.checkout.postalCode + " " + siteConfig.common.required}
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          error={errors.postalCode}
                          placeholder="28001"
                          required
                          maxLength={5}
                        />
                        <Input
                          label={siteConfig.checkout.country}
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          disabled
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {siteConfig.checkout.notes + " " + siteConfig.common.optional}
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={siteConfig.checkout.notesPlaceholder}
                      rows={3}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    className="w-full h-12 text-lg"
                    variant="primary"
                  >
                    {siteConfig.checkout.continueToPayment}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">{siteConfig.checkout.secure}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{siteConfig.checkout.paymentMethods}</p>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">{siteConfig.checkout.shipping}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Certified mail with tracking & insurance</p>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <svg className="h-8 w-8 text-purple-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Protection</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Auto-refund if we can't get it</p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {siteConfig.checkout.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{siteConfig.checkout.subtotal} ({items.reduce((s, i) => s + i.quantity, 0)} {siteConfig.checkout.items})</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Truck className="h-4 w-4" aria-hidden="true" />
                      {siteConfig.checkout.shipping}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 dark:text-green-400">{siteConfig.checkout.free}</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  {totalPrice > 0 && totalPrice < 10000 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      {siteConfig.checkout.addForFreeShipping.replace('{amount}', formatPrice(10000 - totalPrice))}
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="text-gray-900 dark:text-white">{siteConfig.checkout.total}</span>
                    <span className="text-gray-900 dark:text-white">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}