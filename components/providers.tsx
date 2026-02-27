"use client"

import type React from "react"

import { Toaster } from "@/components/ui/toaster"
import { TrialTestProvider } from "@/components/trial-test-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrialTestProvider>
      {children}
      <Toaster />
    </TrialTestProvider>
  )
}
