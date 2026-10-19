"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Sparkles, Search, Banknote, MessageSquare } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { RequestDrawer } from "@/components/RequestDrawer"

export default function RequestPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = () => {
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-900/10 via-pink-900/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Hero */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full mb-6 animate-slide-up">
                <Search className="h-3 w-3" aria-hidden="true" />
                <span className="font-medium">Custom Figure Search</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 animate-slide-up delay-100 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {siteConfig.request.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up delay-200">
                {siteConfig.request.subtitle}
              </p>
              <Button 
                onClick={openDrawer} 
                size="lg" 
                className="gap-3 group relative overflow-hidden animate-slide-up delay-300" 
                variant="primary"
              >
                <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                <span className="relative z-10 text-lg">Request a Figure</span>
                <Search className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24 animate-fade-in">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Banknote, title: "Japan Prices", desc: "We search at best price from Japanese suppliers" },
                { icon: Sparkles, title: "Priority Access", desc: "If found, you get first dibs to reserve" },
                { icon: MessageSquare, title: "No Commitment", desc: "Only reserve if you like the final price" },
              ].map((benefit, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800 p-6 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 mb-4">
                    <benefit.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 text-white border-purple-500/30 animate-fade-in">
              <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-slow" />
              <CardContent className="p-8 md:p-12 text-center relative z-10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4 animate-pulse-slow">
                  <Search className="h-8 w-8" aria-hidden="true" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Can't Find Your Figure?</h2>
                <p className="text-pink-100 mb-8 max-w-xl mx-auto text-lg">
                  Request it and we'll search our Japan suppliers. If found, you get priority to reserve.
                </p>
                <Button 
                  onClick={() => setDrawerOpen(true)} 
                  size="lg" 
                  variant="secondary" 
                  className="gap-2 bg-white text-pink-600 hover:bg-pink-50 group relative overflow-hidden"
                >
                  <span className="relative z-10">Request Figure</span>
                  <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <RequestDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}