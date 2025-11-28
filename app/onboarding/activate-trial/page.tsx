"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Clock, TrendingDown, AlertCircle, Check } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function ActivateTrialPage() {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)

  const handleActivateTrial = () => {
    if (!agreedToTerms) {
      return
    }
    // Handle credit card addition and trial activation
    console.log("Activating trial...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Activate Your Link Protector Free Trial
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Start protecting your links today with our 14-day free trial. No charges until your trial ends.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Section 1: Free Trial Terms */}
          <Card className="border-2 border-blue-100 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-2xl">14-Day Free Trial</CardTitle>
              </div>
              <CardDescription>Everything you need to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Your Limits */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Your Limits</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-white p-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">14-day duration</p>
                      <p className="mt-1 text-sm text-gray-600">Full access to all features for two weeks</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-white p-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Maximum 10,000 sessions included</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Sessions exceeding 10,000 will be charged retroactively at standard rates when the trial ends
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  You will receive email reminders <strong>7 days</strong> and <strong>1 day</strong> before the trial
                  ends to cancel.
                </p>
              </div>

              {/* Payment Failure Warning */}
              <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-orange-600" />
                <p className="text-sm leading-relaxed text-gray-700">
                  <strong>Important:</strong> If payment fails, all traffic will be stopped.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Usage-Based Billing */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <CardTitle className="text-2xl">Simple Usage-Based Pricing</CardTitle>
              </div>
              <CardDescription>Pay Less as You Scale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Billing Cycle */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-gray-900">Billing Cycle:</span> Billed monthly on the 1st of every
                  month
                </p>
              </div>

              {/* Core Explanation */}
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-6">
                  <p className="text-balance text-base leading-relaxed text-gray-800">
                    Link Protector charges only <strong className="text-lg text-gray-900">$0.12 per participant</strong>{" "}
                    for your first 2,000 sessions. As your traffic grows, your cost automatically drops to as low as{" "}
                    <strong className="text-lg text-green-700">$0.01 per participant</strong>.
                  </p>
                </div>

                {/* Visual Aid */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span>Higher volume</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span>Lower cost per participant</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Pricing Table */}
              <Collapsible open={isPricingOpen} onOpenChange={setIsPricingOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    {isPricingOpen ? "Hide" : "View"} Full Pricing Details
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b px-4 py-3 text-left font-semibold text-gray-900">
                            Monthly Participants
                          </th>
                          <th className="border-b px-4 py-3 text-right font-semibold text-gray-900">
                            Price Per Participant
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y bg-white">
                        {[
                          { range: "0 – 2,000", price: "USD $0.12" },
                          { range: "2,001 – 10,000", price: "USD $0.08" },
                          { range: "10,001 – 25,000", price: "USD $0.06" },
                          { range: "25,001 – 50,000", price: "USD $0.04" },
                          { range: "50,001 – 100,000", price: "USD $0.02" },
                          { range: "100,001+", price: "USD $0.01" },
                        ].map((tier, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700">{tier.range}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-900">{tier.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Call to Action */}
        <Card className="mt-8 border-2 border-gray-200">
          <CardContent className="space-y-6 p-8">
            {/* Legal Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed text-gray-700">
                I understand and agree to the 14-day trial limits and the usage-based billing structure.
              </label>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <Button onClick={handleActivateTrial} disabled={!agreedToTerms} size="lg" className="h-14 w-full text-lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Add Credit Card and Start Free Trial
              </Button>

              {/* Billing Note */}
              <p className="text-center text-sm text-gray-600">
                Your card will be saved and verified, but you will not be charged until your trial ends.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-6">
              <Badge variant="secondary" className="gap-1.5">
                <Check className="h-3 w-3" />
                No charges during trial
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Check className="h-3 w-3" />
                Cancel anytime
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Check className="h-3 w-3" />
                Secure payment
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
