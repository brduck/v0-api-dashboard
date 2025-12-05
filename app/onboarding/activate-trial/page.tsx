"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, ChevronDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

export default function ActivateTrialPage() {
  const [showPricing, setShowPricing] = useState(false)
  const [sessionCount, setSessionCount] = useState(15000)

  const pricingTiers = [
    { min: 0, max: 2000, rate: 0.12, label: "0 – 2,000" },
    { min: 2001, max: 10000, rate: 0.08, label: "2,001 – 10,000" },
    { min: 10001, max: 25000, rate: 0.06, label: "10,001 – 25,000" },
    { min: 25001, max: 50000, rate: 0.04, label: "25,001 – 50,000" },
    { min: 50001, max: 100000, rate: 0.02, label: "50,001 – 100,000" },
    { min: 100001, max: Number.POSITIVE_INFINITY, rate: 0.01, label: "100,001+" },
  ]

  const getCurrentTier = (sessions: number) => {
    return pricingTiers.find((tier) => sessions >= tier.min && sessions <= tier.max) || pricingTiers[0]
  }

  const calculatePrice = (sessions: number) => {
    const tier = getCurrentTier(sessions)
    return sessions * tier.rate
  }

  const currentTier = getCurrentTier(sessionCount)
  const monthlyTotal = calculatePrice(sessionCount)

  const handleActivateTrial = () => {
    console.log("Activating trial...")
  }

  const handleSliderChange = (value: number[]) => {
    setSessionCount(Math.min(value[0], 150000))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setSessionCount(Math.max(0, Math.min(value, 150000)))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            Start Your <span className="text-green-600">Free</span> Trial
          </h1>
          <p className="mt-6 text-pretty text-xl leading-8 text-muted-foreground">
            30 days free. No charges. Experience Link Protector risk-free.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          {/* What's Included */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">What's included in your trial</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">30 days of full access</p>
                  <p className="mt-1 text-muted-foreground">Try all features with no restrictions</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">Up to 10,000 sessions</p>
                  <p className="mt-1 text-muted-foreground">
                    Generous limits to test at scale. Sessions exceeding 10,000 during the trial are billable
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">No charges during trial</p>
                  <p className="mt-1 text-muted-foreground">
                    No charges today. A card is required to activate the trial. Your first bill will happen when the
                    trial ends.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Easy cancellation:</strong> Email reminders at 7 days and 1 day
                before trial ends. Cancel anytime with one click.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <button
              onClick={() => setShowPricing(!showPricing)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h2 className="text-2xl font-semibold">After your trial: Simple pricing</h2>
                <p className="mt-2 text-muted-foreground">Only pay for what you use. Prices drop as you scale.</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                  showPricing ? "rotate-180" : ""
                }`}
              />
            </button>

            {showPricing && (
              <div className="mt-6 space-y-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Estimate your monthly cost</h3>

                  <div className="space-y-4">
                    {/* Slider */}
                    <div className="space-y-2">
                      <Slider
                        value={[sessionCount]}
                        onValueChange={handleSliderChange}
                        max={150000}
                        step={1000}
                        className="w-full"
                      />
                    </div>

                    {/* Number Input */}
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={sessionCount}
                        onChange={handleInputChange}
                        className="text-lg"
                        min={0}
                        max={150000}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">sessions/month</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Output */}
                <div className="rounded-lg bg-primary/5 p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[hsl(var(--brand))]">
                      ${monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-lg font-normal text-muted-foreground"> / month</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {sessionCount.toLocaleString()} sessions × ${currentTier.rate.toFixed(2)} per session
                    </p>
                  </div>
                </div>

                {/* Interactive Pricing Table */}
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Monthly Sessions</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Price Per Session</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pricingTiers.map((tier) => {
                        const isActive = sessionCount >= tier.min && sessionCount <= tier.max
                        return (
                          <tr
                            key={tier.label}
                            className={`transition-colors ${
                              isActive ? "bg-primary/10 font-medium" : "opacity-50 hover:opacity-75"
                            }`}
                          >
                            <td className="px-4 py-3 text-sm">{tier.label}</td>
                            <td className="px-4 py-3 text-right text-sm">${tier.rate.toFixed(2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-muted-foreground">Billed monthly on the 1st. Cancel anytime.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="space-y-6">
              <Button
                onClick={handleActivateTrial}
                size="lg"
                className="h-14 w-full text-lg bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Add Payment & Start Free Trial
              </Button>

              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                By adding my credit card, I understand the 30-day trial includes up to 10,000 sessions at no charge. I
                agree that any sessions exceeding 10,000 will be charged at the standard usage-based rate when the trial
                ends, and I agree to ongoing usage-based billing after the trial ends.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
