"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, CreditCard, ChevronDown, Shield, Zap, TrendingDown } from "lucide-react"

export default function ActivateTrialPage() {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

  const handleActivateTrial = () => {
    if (!agreedToTerms) return
    console.log("Activating trial...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm">
            <Shield className="h-4 w-4 text-primary" />
            Enterprise-Grade Security
          </div>
          <h1 className="text-balance text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            Start Your Free Trial
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-xl leading-relaxed text-muted-foreground sm:text-2xl">
            Experience Link Protector for 14 days. Full access, no commitments, no charges.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {/* Trial Benefits */}
          <div className="group relative overflow-hidden rounded-3xl border bg-card shadow-lg transition-shadow hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative p-10">
              <h2 className="mb-8 text-3xl font-semibold tracking-tight">Your 14-Day Trial Includes</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                    <Zap className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xl font-semibold">Complete feature access</p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      Every security feature, every integration, every capability at your fingertips
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                    <Check className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xl font-semibold">10,000 sessions included</p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      Test at scale with generous limits designed for real-world validation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                    <Shield className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xl font-semibold">Zero payment risk</p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      Card verification only—you won't be charged a single cent until day 15
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <p className="leading-relaxed text-muted-foreground">
                  <strong className="font-semibold text-foreground">Seamless cancellation:</strong> Automated reminders
                  at 7 days and 24 hours before trial ends. One-click cancellation with no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="group relative overflow-hidden rounded-3xl border bg-card shadow-lg transition-shadow hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <button
                onClick={() => setShowPricing(!showPricing)}
                className="flex w-full items-center justify-between p-10 text-left transition-colors"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-foreground/80">
                    <TrendingDown className="h-7 w-7 text-background" />
                  </div>
                  <div className="pt-1">
                    <h2 className="text-3xl font-semibold tracking-tight">Transparent Pricing</h2>
                    <p className="mt-2 text-lg text-muted-foreground">
                      Usage-based billing that scales with your growth. Pay less as you grow more.
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    showPricing ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPricing && (
                <div className="space-y-8 border-t px-10 pb-10 pt-8">
                  {/* Key Value Prop */}
                  <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
                    <p className="text-2xl font-medium leading-relaxed">
                      From <span className="font-bold text-primary">$0.12</span> per session down to{" "}
                      <span className="font-bold text-primary">$0.01</span> at enterprise scale
                    </p>
                  </div>

                  {/* Pricing Table */}
                  <div className="overflow-hidden rounded-2xl border shadow-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted">
                          <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Monthly Sessions
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Price Per Session
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[
                          { range: "0 – 2,000", price: "$0.12", highlight: false },
                          { range: "2,001 – 10,000", price: "$0.08", highlight: false },
                          { range: "10,001 – 25,000", price: "$0.06", highlight: true },
                          { range: "25,001 – 50,000", price: "$0.04", highlight: false },
                          { range: "50,001 – 100,000", price: "$0.02", highlight: false },
                          { range: "100,001+", price: "$0.01", highlight: false },
                        ].map((tier) => (
                          <tr
                            key={tier.range}
                            className={`transition-colors hover:bg-muted/50 ${tier.highlight ? "bg-primary/5" : ""}`}
                          >
                            <td className="px-6 py-4 text-base font-medium">{tier.range}</td>
                            <td className="px-6 py-4 text-right text-lg font-semibold">{tier.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-center text-muted-foreground">
                    Billed monthly on the 1st. Pause or cancel anytime with full control.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-3xl border bg-card p-10 shadow-lg">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1.5 h-5 w-5"
                />
                <label htmlFor="terms" className="cursor-pointer leading-relaxed text-muted-foreground">
                  I understand the 14-day trial includes up to 10,000 sessions at no charge, and I agree to usage-based
                  billing after the trial period.
                </label>
              </div>

              <Button
                onClick={handleActivateTrial}
                disabled={!agreedToTerms}
                size="lg"
                className="h-16 w-full text-lg font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <CreditCard className="mr-3 h-6 w-6" />
                Add Payment Method & Start Free Trial
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-8 border-t pt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Bank-level encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>No hidden fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
