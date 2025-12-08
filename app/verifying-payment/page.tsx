"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CreditCard } from "lucide-react"
import { useTrialTest } from "@/components/trial-test-context"

export default function VerifyingPaymentPage() {
  const router = useRouter()
  const { settings } = useTrialTest()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (settings.validPaymentMethod) {
        router.push("/link-protectors?payment=success")
      } else {
        router.push("/payment-required")
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [settings.validPaymentMethod, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--brand))]/20 to-[hsl(var(--brand))]/10">
          <CreditCard className="h-12 w-12 text-[hsl(var(--brand))]" />
        </div>

        {/* Heading */}
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl mb-4">Verifying Payment Method</h1>

        {/* Description */}
        <p className="text-pretty text-lg leading-8 text-muted-foreground mb-8">
          Please wait while we verify your payment details
        </p>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--brand))]" />
          <span className="text-sm text-muted-foreground">This may take a few moments...</span>
        </div>

        {/* Progress Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--brand))] animate-pulse" style={{ animationDelay: "0s" }} />
          <div
            className="h-2 w-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="h-2 w-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
        </div>
      </div>
    </div>
  )
}
