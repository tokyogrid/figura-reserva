"use client"

import { useEffect } from "react"

export function useCSRFInit() {
  useEffect(() => {
    // Initialize CSRF token on app load
    fetch("/api/csrf", { credentials: "include" }).catch(() => {
      // Silently fail - CSRF will be initialized on first mutation attempt
    })
  }, [])
}