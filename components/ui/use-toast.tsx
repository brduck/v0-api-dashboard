"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

type ToastProps = {
  title: string
  description: string
}

type ToastContextType = {
  toasts: ToastProps[]
  toast: (props: ToastProps) => void
  dismiss: (index: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => {
        if (prev.length > 0) {
          return prev.slice(1)
        }
        return prev
      })
    }, 3000)
  }, [])

  const dismiss = useCallback((index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// For components that can't use the hook directly
export const toast = (props: ToastProps) => {
  console.log(`Toast: ${props.title} - ${props.description}`)
  // This is just a fallback for when the context isn't available
  // The actual toast functionality will be handled by the ToastProvider
}
