"use client"

import { useCallback, useRef } from "react"

let csrfTokenCache: string | null = null
let csrfTokenPromise: Promise<string> | null = null

export function useCSRF() {
  const getToken = useCallback(async (): Promise<string> => {
    // Return cached token if available
    if (csrfTokenCache) return csrfTokenCache

    // Return existing promise if fetch in progress
    if (csrfTokenPromise) return csrfTokenPromise

    // Fetch new token
    csrfTokenPromise = (async () => {
      try {
        const res = await fetch("/api/csrf-token", { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch CSRF token")
        const data = await res.json()
        csrfTokenCache = data.token
        return data.token
      } catch (error) {
        csrfTokenPromise = null
        throw error
      }
    })()

    return csrfTokenPromise
  }, [])

  const fetchWithCSRF = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const token = await getToken()
      return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          "x-csrf-token": token,
        },
      })
    },
    [getToken]
  )

  const clearCache = useCallback(() => {
    csrfTokenCache = null
    csrfTokenPromise = null
  }, [])

  return { getToken, fetchWithCSRF, clearCache }
}