"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, ChevronDown } from "lucide-react"

export default function ActivateTrialPage() {
  const [showPricing, setShowPricing] = useState(false)

  const handleActivateTrial = () => {
    console.log("Activating trial...")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">Start Your Free Trial</h1>
          <p className="mt-6 text-pretty text-xl leading-8 text-muted-foreground">
            14 days free. No charges. Experience Link Protector risk-free.
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
                  <p className="font-medium text-lg">14 days of full access</p>
                  <p className="mt-1 text-muted-foreground">Try all features with no restrictions</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">Up to 10,000 sessions</p>
                  <p className="mt-1 text-muted-foreground">Generous limits to test at scale</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">No charges during trial</p>
                  <p className="mt-1 text-muted-foreground">Your card is verified but never charged until day 15</p>
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
                {/* Key pricing message */}
                <div className="rounded-lg bg-primary/5 p-6">
                  <p className="text-lg leading-relaxed">
                    Start at <strong className="text-primary">$0.12</strong> per session, dropping to just{" "}
                    <strong className="text-primary">$0.01</strong> at scale.
                  </p>
                </div>

                {/* Pricing tiers */}
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-semibold">Monthly Sessions</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { range: "0 – 2,000", price: "$0.12" },
                        { range: "2,001 – 10,000", price: "$0.08" },
                        { range: "10,001 – 25,000", price: "$0.06" },
                        { range: "25,001 – 50,000", price: "$0.04" },
                        { range: "50,001 – 100,000", price: "$0.02" },
                        { range: "100,001+", price: "$0.01" },
                      ].map((tier) => (
                        <tr key={tier.range} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm">{tier.range}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium">{tier.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-muted-foreground">Billed monthly on the 1st. Cancel anytime.</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="space-y-6">
              <Button onClick={handleActivateTrial} size="lg" className="h-14 w-full text-lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Add Payment & Start Free Trial
              </Button>

              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                By adding my credit card, I understand the 14-day trial includes up to 10,000 sessions at no charge, and
                I agree to usage-based billing after the trial ends.
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
