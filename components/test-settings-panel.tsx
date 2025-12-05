"use client"

import type React from "react"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { useTrialTest } from "@/components/trial-test-context"

export function TestSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings } = useTrialTest()

  const handleDaysLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    updateSettings({ daysLeft: Math.max(0, Math.min(value, 14)) })
  }

  const handleSessionsUsedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    updateSettings({ sessionsUsed: Math.max(0, Math.min(value, settings.totalSessions)) })
  }

  const handleTrialActiveChange = (checked: boolean) => {
    updateSettings({ isTrialActive: checked })
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-black hover:bg-gray-800"
        size="icon"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 p-6 shadow-xl border-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Test Settings</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Days Left */}
            <div className="space-y-2">
              <Label htmlFor="daysLeft">Days Left on Trial</Label>
              <Input
                id="daysLeft"
                type="number"
                min="0"
                max="14"
                value={settings.daysLeft}
                onChange={handleDaysLeftChange}
              />
              <p className="text-xs text-muted-foreground">Max: 30 days</p>
            </div>

            {/* Sessions Used */}
            <div className="space-y-2">
              <Label htmlFor="sessionsUsed">Sessions Used</Label>
              <Input
                id="sessionsUsed"
                type="number"
                min="0"
                max={settings.totalSessions}
                value={settings.sessionsUsed}
                onChange={handleSessionsUsedChange}
              />
              <p className="text-xs text-muted-foreground">
                Max: 25000
              </p>
            </div>

            {/* Trial Active Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="trialActive" className="cursor-pointer">
                Free Trial Active
              </Label>
              <Switch id="trialActive" checked={settings.isTrialActive} onCheckedChange={handleTrialActiveChange} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              These settings are for testing only and will affect the trial badge and dialogs throughout the UI.
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
