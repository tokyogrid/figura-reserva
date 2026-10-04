"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface User {
  id: string
  email: string
  name?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    if (!loginRes.ok) {
      const data = await loginRes.json()
      if (data.requiresVerification) {
        // Redirect to verification page
        throw new Error(`VERIFICATION_REQUIRED:${data.email}`)
      }
      throw new Error(data.error || "Invalid credentials")
    }
    
    // Refresh user after login
    const meRes = await fetch("/api/auth/me", { credentials: "include" })
    if (meRes.ok) {
      const data = await meRes.json()
      if (data.user) setUser(data.user)
    }
  }

  const logout = async () => {
    const logoutRes = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    
    if (logoutRes.ok) {
      setUser(null)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    })

    if (!registerRes.ok) {
      const data = await registerRes.json()
      throw new Error(data.error || "Registration failed")
    }
    
    // User is automatically logged in after registration
    const meRes = await fetch("/api/auth/me", { credentials: "include" })
    if (meRes.ok) {
      const data = await meRes.json()
      if (data.user) setUser(data.user)
    }
  }

  const refreshUser = async () => {
    const meRes = await fetch("/api/auth/me", { credentials: "include" })
    if (meRes.ok) {
      const data = await meRes.json()
      if (data.user) setUser(data.user)
      else setUser(null)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}