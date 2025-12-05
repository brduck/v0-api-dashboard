"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TrialTestSettings {
  daysLeft: number
  sessionsUsed: number
  totalSessions: number
  isTrialActive: boolean
}

interface TrialTestContextType {
  settings: TrialTestSettings
  updateSettings: (updates: Partial<TrialTestSettings>) => void
}

const TrialTestContext = createContext<TrialTestContextType | undefined>(undefined)

export function TrialTestProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<TrialTestSettings>({
    daysLeft: 28,
    sessionsUsed: 3450,
    totalSessions: 25000,
    isTrialActive: true,
  })

  const updateSettings = (updates: Partial<TrialTestSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  return <TrialTestContext.Provider value={{ settings, updateSettings }}>{children}</TrialTestContext.Provider>
}

export function useTrialTest() {
  const context = useContext(TrialTestContext)
  if (context === undefined) {
    throw new Error("useTrialTest must be used within a TrialTestProvider")
  }
  return context
}
