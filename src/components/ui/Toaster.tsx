"use client"

import { useState, useCallback, createContext, useContext, ReactNode } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToasterContextType {
  toast: (toast: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined)

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((newToast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...newToast, id }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToasterContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToasterList toasts={toasts} dismiss={dismiss} />
    </ToasterContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToasterContext)
  if (!context) {
    throw new Error("useToast must be used within a ToasterProvider")
  }
  return context
}

function ToasterList({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }

  const colors = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400",
  }

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in",
              colors[toast.type]
            )}
            role="alert"
            aria-live="polite"
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColors[toast.type])} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{toast.title}</p>
              {toast.message && (
                <p className="text-sm mt-0.5 opacity-90">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4 opacity-50 hover:opacity-100" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function Toaster() {
  const [mounted, setMounted] = useState(false)
  useState(() => { setMounted(true); return () => setMounted(false) })
  
  if (!mounted) return null
  
  // This component is just a placeholder - the real toaster is in ToasterProvider
  return null
}