"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useToast } from "@/components/ui/Toaster"
import { Sparkles, Mail, MessageSquare, Loader2 } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "forgot_password",
    message: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error sending message")

      toast({ 
        type: "success", 
        title: "Message sent!", 
        message: `Your ticket ID: ${data.ticketId}` 
      })
      setFormData({ name: "", email: "", subject: "forgot_password", message: "" })
    } catch (error: any) {
      setError(error.message)
      toast({ type: "error", title: "Error", message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-12">
      <div className="container max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/login" className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white">Contact Support</h1>
        </div>

        <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Contact Support</h1>
            <p className="text-gray-400">
              Forgot your password? Need help with your account? Fill out the form below and we'll get back to you via email.
            </p>
          </CardHeader>
          <CardContent className="bg-gray-900/30">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
                autoComplete="name"
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              />

              <Input
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
              />

              <select
                id="subject"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="forgot_password">Forgot Password</option>
                <option value="account_help">Account Help</option>
                <option value="order_issue">Order Issue</option>
                <option value="other">Other</option>
              </select>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue..."
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                />
              </div>

              <Button type="submit" disabled={loading} loading={loading} className="w-full h-12" variant="primary">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </span>
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                We'll respond within 24-48 hours. For urgent issues, check your spam folder.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-purple-400 hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}