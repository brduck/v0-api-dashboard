"use client"

import type React from "react"

import { ToastProvider } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/context/user-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </UserProvider>
  )
}
