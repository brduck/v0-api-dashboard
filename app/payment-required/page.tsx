"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertTriangle, ChevronDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PaymentRequiredPage() {
  const router = useRouter()
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

  const handleAddPayment = () => {
    router.push("/verifying-payment")
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
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Payment Method Required</h1>
          <p className="mt-4 text-pretty text-lg leading-8 text-muted-foreground">
            Your trial has ended or payment has failed
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          {/* Alert Notice */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-900">All Link Protectors Are Paused</h2>
                <p className="mt-2 text-red-800 leading-relaxed">
                  Your link protectors are currently inactive and not processing any traffic. To resume service and
                  continue protecting your links, please add a valid payment method below.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Calculator */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <button
              onClick={() => setShowPricing(!showPricing)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h2 className="text-2xl font-semibold">Usage-Based Pricing</h2>
                <p className="mt-2 text-muted-foreground">Calculate your expected monthly cost</p>
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

                <p className="text-sm text-muted-foreground">
                  Billed monthly on the 1st. Only pay for what you use. Cancel anytime.
                </p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Resume Your Service</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a payment method to reactivate all your link protectors
                </p>
              </div>

              <Button
                onClick={handleAddPayment}
                size="lg"
                className="h-14 w-full text-lg bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Add Payment Method
              </Button>

              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Once your payment is processed, all link protectors will be automatically reactivated within minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Support Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/support" className="font-medium text-[hsl(var(--brand))] hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
