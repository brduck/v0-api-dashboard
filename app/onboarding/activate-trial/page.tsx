"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Users } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function ActivateTrialPage() {
  const router = useRouter()
  const [sessionCount, setSessionCount] = useState(15000)
  const [faqOpen, setFaqOpen] = useState<{ [key: string]: boolean }>({})

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
    router.push("/link-protectors")
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Start Your <span className="text-green-600">Free</span> Trial
          </h1>
          <p className="mt-4 text-pretty text-lg leading-8 text-muted-foreground">
            30 days free. No credit card required. Experience Link Protector risk-free.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Left Column - Pricing Calculator */}
          <div className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">When your trial ends: Volume based pricing</h2>
              <p className="mt-1 text-sm text-muted-foreground">Only pay for what you use. Prices drop as you scale.</p>
            </div>

            <div className="mt-6 flex-1 space-y-4">
              {/* Input Section */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-medium">Estimate your monthly cost</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    How many participant sessions do you expect to check?
                  </p>
                </div>

                <div className="space-y-3">
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

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        type="number"
                        value={sessionCount}
                        onChange={handleInputChange}
                        className="pl-10 text-base"
                        min={0}
                        max={150000}
                      />
                    </div>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">participant sessions</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Output */}
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--brand))]">
                    ${monthlyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-base font-normal text-muted-foreground"> / month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {sessionCount.toLocaleString()} sessions × ${currentTier.rate.toFixed(2)} per session
                  </p>
                </div>
              </div>

              {/* Interactive Pricing Table */}
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left text-xs font-semibold">Monthly Sessions</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold">Price Per Session</th>
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
                          <td className="px-3 py-2 text-xs">{tier.label}</td>
                          <td className="px-3 py-2 text-right text-xs">${tier.rate.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted-foreground">Billed monthly on the 1st.</p>
            </div>
          </div>

          {/* Right Column - What's Included */}
          <div className="flex flex-col space-y-6">
            <div className="flex-1 rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">What's included in your trial</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">30 days of full access</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">Try all features with no restrictions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Up to 25,000 sessions</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Generous limits to test at scale. Sessions exceeding 25,000 during the trial are billable
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">No Credit Card required</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Start your trial immediately. Add payment details later when you're ready.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">
                  Email reminders will be sent 7 days and 1 day before the trial ends.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="mt-6 space-y-3">
                <h3 className="text-base font-semibold">What happens when my trial ends?</h3>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    When your trial ends, you will be prompted to add a valid payment method. Your account will then
                    transition to our volume usage-based pricing. You can use the calculator on the left to estimate
                    your expected costs.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <Button
                  onClick={handleActivateTrial}
                  size="lg"
                  className="h-12 w-full text-base bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white"
                >
                  Start Free Trial
                </Button>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Need help getting started?{" "}
                    <a
                      href="https://dtect.io/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Contact us
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
