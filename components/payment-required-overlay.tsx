"use client"

import type React from "react"

import { AlertTriangle, CreditCard, ChevronDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

export function PaymentRequiredOverlay() {
  const router = useRouter()
  const [showPricing, setShowPricing] = useState(false)
  const [sessionCount, setSessionCount] = useState(15000)

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

  const handleAddPayment = () => {
    router.push("/verifying-payment")
  }

  const handleSliderChange = (value: number[]) => {
    setSessionCount(Math.min(value[0], 550000))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setSessionCount(Math.max(0, Math.min(value, 550000)))
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
        <div className="bg-background rounded-xl shadow-2xl p-6 space-y-5">
          {/* Hero */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Payment Method Required</h1>
            <p className="mt-2 text-pretty text-base leading-7 text-muted-foreground">
              Add a valid payment method to keep using Link Protector
            </p>
          </div>

          {/* Alert Notice */}
          <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">All Link Protectors Are Paused</h2>
                <p className="mt-1 text-sm text-red-800 leading-relaxed">
                  Your link protectors are <strong>currently paused and not processing any traffic.</strong> To resume
                  service and continue protecting your links, please add a valid payment method below.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Resume Your Service</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a payment method to reactivate all your link protectors
                </p>
              </div>

              <Button
                onClick={handleAddPayment}
                size="lg"
                className="h-12 w-full text-base bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Add Payment Method
              </Button>

              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Once your payment is processed, all link protectors will be automatically reactivated.
                </p>
              </div>

              <div className="pt-2 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
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

          {/* Pricing Calculator */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <button
              onClick={() => setShowPricing(!showPricing)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h2 className="text-lg font-semibold">Volume based pricing</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Only pay for what you use. Prices drop as you scale.
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                  showPricing ? "rotate-180" : ""
                }`}
              />
            </button>

            {showPricing && (
              <div className="mt-4 space-y-4">
                {/* Input Section */}
                <div className="space-y-3">
                  <h3 className="text-base font-medium">Estimate your monthly cost</h3>
                  <p className="text-sm text-muted-foreground">How many participant sessions do you expect to check?</p>

                  <div className="space-y-3">
                    {/* Slider */}
                    <div className="space-y-2">
                      <Slider
                        value={[sessionCount]}
                        onValueChange={handleSliderChange}
                        max={550000}
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
                          max={550000}
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
                      $
                      {monthlyTotal?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-base font-normal text-muted-foreground"> / month</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {sessionCount.toLocaleString()} sessions × ${currentTier.rate.toFixed(4)} per session
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
                            <td className="px-3 py-2 text-right text-xs">`$${tier.rate.toFixed(4)}`</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-muted-foreground">
                  Billed monthly on the 1st. Only pay for what you use. Cancel anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
