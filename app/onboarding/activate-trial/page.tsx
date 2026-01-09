"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Users } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ActivateTrialPage() {
  const router = useRouter()
  const [sessionCount, setSessionCount] = useState(15000)
  const [faqOpen, setFaqOpen] = useState<{ [key: string]: boolean }>({})
  const [pricingModalOpen, setPricingModalOpen] = useState(false)

  const pricingTiers = [
    { min: 1, max: 4999, rate: 0.15, label: "1 – 4,999" },
    { min: 5000, max: 9999, rate: 0.075, label: "5,000 – 9,999" },
    { min: 10000, max: 24999, rate: 0.05, label: "10,000 – 24,999" },
    { min: 25000, max: 49999, rate: 0.03, label: "25,000 – 49,999" },
    { min: 50000, max: 99999, rate: 0.018, label: "50,000 – 99,999" },
    { min: 100000, max: 149999, rate: 0.012, label: "100,000 – 149,999" },
    { min: 150000, max: 199999, rate: 0.0108, label: "150,000 – 199,999" },
    { min: 200000, max: 249999, rate: 0.0096, label: "200,000 – 249,999" },
    { min: 250000, max: 499999, rate: 0.0084, label: "250,000 – 499,999" },
    { min: 500000, max: 749999, rate: 0.006, label: "500,000 – 749,999" },
    { min: 750000, max: Number.POSITIVE_INFINITY, rate: 0, label: "750,000+", contactSales: true },
  ]

  const getCurrentTier = (sessions: number) => {
    return pricingTiers.find((tier) => sessions >= tier.min && sessions <= tier.max) || pricingTiers[0]
  }

  const getNextTier = (sessions: number) => {
    const currentIndex = pricingTiers.findIndex((tier) => sessions >= tier.min && sessions <= tier.max)
    if (currentIndex === -1 || currentIndex === pricingTiers.length - 1) return null
    return pricingTiers[currentIndex + 1]
  }

  const calculatePrice = (sessions: number) => {
    const tier = getCurrentTier(sessions)
    if (tier.contactSales) return null
    return sessions * tier.rate
  }

  const currentTier = getCurrentTier(sessionCount)
  const nextTier = getNextTier(sessionCount)
  const monthlyTotal = calculatePrice(sessionCount)

  const handleActivateTrial = () => {
    router.push("/link-protectors")
  }

  const handleSliderChange = (value: number[]) => {
    setSessionCount(Math.min(value[0], 749999))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setSessionCount(Math.max(0, Math.min(value, 749999)))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Start Your <span className="text-[hsl(var(--brand))]">Free Trial</span>
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
                      max={749999}
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
                        max={749999}
                      />
                    </div>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">participant sessions</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Output */}
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="text-center">
                  {currentTier.contactSales ? (
                    <>
                      <div className="text-2xl font-bold text-[hsl(var(--brand))]">Custom Pricing</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        For volumes over 750,000 sessions,{" "}
                        <a
                          href="https://dtect.io/contact"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          contact sales
                        </a>{" "}
                        for special enterprise pricing.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-[hsl(var(--brand))]">
                        $
                        {monthlyTotal?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <span className="text-base font-normal text-muted-foreground"> / month</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {sessionCount.toLocaleString()} sessions × ${currentTier.rate.toFixed(4)} per session
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border bg-card p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      {currentTier.contactSales ? (
                        <span className="text-muted-foreground">
                          {currentTier.label} sessions - Contact Sales for custom pricing
                        </span>
                      ) : (
                        <>
                          <span className="font-semibold">Current Tier:</span>
                          <span className="text-muted-foreground">
                            {currentTier.label} sessions @ ${currentTier.rate.toFixed(4)}
                            /session
                          </span>
                        </>
                      )}
                    </div>
                    {nextTier && !nextTier.contactSales && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Next Tier:</span>
                        <span className="text-muted-foreground">
                          {nextTier.label} sessions @ ${nextTier.rate.toFixed(4)}/session
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Dialog open={pricingModalOpen} onOpenChange={setPricingModalOpen}>
                  <DialogTrigger asChild>
                    <button className="text-sm text-primary hover:underline font-medium">
                      View all pricing tiers →
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Volume Pricing Tiers</DialogTitle>
                      <DialogDescription>
                        Our pricing automatically adjusts based on your monthly session volume. The rate for your tier
                        applies to all sessions.
                      </DialogDescription>
                    </DialogHeader>
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
                                  isActive ? "bg-primary/10 font-medium" : "hover:bg-muted/50"
                                }`}
                              >
                                <td className="px-4 py-3 text-sm">{tier.label}</td>
                                <td className="px-4 py-3 text-right text-sm">
                                  {tier.contactSales ? (
                                    <span className="text-primary font-medium">Contact Sales</span>
                                  ) : (
                                    `$${tier.rate.toFixed(4)}`
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </DialogContent>
                </Dialog>
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
