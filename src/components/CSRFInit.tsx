"use client"

import { useCSRFInit } from "@/hooks/useCSRFInit"

export function CSRFInit() {
  useCSRFInit()
  return null
}