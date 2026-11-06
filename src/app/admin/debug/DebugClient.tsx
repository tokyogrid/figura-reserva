"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function DebugClient() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  const [session, setSession] = useState<{authenticated: boolean, session: any, error?: string} | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/me")
      const data = await res.json()
      setSession(data)
    } catch (e) {
      setSession({ authenticated: false, session: null, error: String(e) })
    }
  }

  useEffect(() => { checkAuth() }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult("Logging in...")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      setResult(`Status: ${res.status}\n${JSON.stringify(data, null, 2)}`)
      if (res.ok) {
        setTimeout(checkAuth, 500)
      }
    } catch (e) {
      setResult("Error: " + e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>Admin Auth Debug</h1>
      
      <Card style={{ marginBottom: "20px" }}>
        <CardHeader><CardTitle>Session Status</CardTitle></CardHeader>
        <CardContent>
          <pre style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px", overflow: "auto" }}>
            {JSON.stringify(session, null, 2)}
          </pre>
          <Button onClick={checkAuth} variant="outline" style={{ marginTop: "10px" }}>Refresh Session</Button>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <CardHeader><CardTitle>Test Login</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
            <div>
              <label>Email: </label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
            </div>
            <div>
              <label>Password: </label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" disabled={loading} loading={loading} className="w-full">Login</Button>
          </form>
          <pre style={{ marginTop: "20px", background: "#f5f5f5", padding: "15px", borderRadius: "8px", whiteSpace: "pre-wrap" }}>{result || "Click login to test"}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
        <CardContent style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a href="/admin"><Button variant="outline">Go to /admin</Button></a>
          <a href="/admin/login"><Button variant="outline">Go to /admin/login</Button></a>
          <a href="/admin/products/new"><Button variant="outline">Go to /admin/products/new</Button></a>
        </CardContent>
      </Card>
    </div>
  )
}