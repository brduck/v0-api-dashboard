"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock, AlertTriangle, CreditCard, StopCircle, ChevronDown, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useTrialTest } from "@/components/trial-test-context"

export function TrialBadgeDialog() {
  const router = useRouter()
  const [showTrialDialog, setShowTrialDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [sessionCount, setSessionCount] = useState(15000)

  const { settings } = useTrialTest()
  const { daysLeft, sessionsUsed, totalSessions, isTrialActive } = settings
  const sessionsLeft = totalSessions - sessionsUsed

  const totalDays = 30
  const daysUsedPercentage = ((totalDays - daysLeft) / totalDays) * 100
  const sessionsUsedPercentage = (sessionsUsed / totalSessions) * 100

  const maxUsagePercentage = Math.max(daysUsedPercentage, sessionsUsedPercentage)
  const getBadgeColor = () => {
    if (maxUsagePercentage < 30) return { border: "border-green-500", text: "text-green-700", bg: "bg-green-50" }
    if (maxUsagePercentage < 80) return { border: "border-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50" }
    return { border: "border-red-500", text: "text-red-700", bg: "bg-red-50" }
  }

  const getSectionColor = (usedPercentage: number) => {
    if (usedPercentage < 30) {
      return {
        gradient: "from-green-50 to-green-100",
        iconBg: "bg-green-100",
        iconColor: "text-green-700",
        barColor: "bg-green-500",
      }
    }
    if (usedPercentage < 80) {
      return {
        gradient: "from-yellow-50 to-yellow-100",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-700",
        barColor: "bg-yellow-500",
      }
    }
    return {
      gradient: "from-red-50 to-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-700",
      barColor: "bg-red-500",
    }
  }

  const daysColor = getSectionColor(daysUsedPercentage)
  const sessionsColor = getSectionColor(sessionsUsedPercentage)

  const badgeColor = getBadgeColor()

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

  const handleSliderChange = (value: number[]) => {
    setSessionCount(Math.min(value[0], 150000))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setSessionCount(Math.max(0, Math.min(value, 150000)))
  }

  const handleStopTrial = () => {
    setShowTrialDialog(false)
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    console.log("Trial cancelled")
    setShowCancelDialog(false)
  }

  const handleAddCreditCard = () => {
    router.push("/onboarding/activate-trial")
    setShowTrialDialog(false)
  }

  if (!isTrialActive) {
    return null
  }

  return (
    <>
      <Badge
        variant="outline"
        className={`cursor-pointer hover:bg-gray-100 transition-colors ${badgeColor.border} ${badgeColor.text} ${badgeColor.bg}`}
        onClick={() => setShowTrialDialog(true)}
      >
        <Clock className="w-3 h-3 mr-1" />
        {daysLeft} days left
      </Badge>

      <Dialog open={showTrialDialog} onOpenChange={setShowTrialDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Free Trial Status</DialogTitle>
            <DialogDescription>Track your trial progress and manage your subscription</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Days Left Card - Apply dynamic colors based on days usage */}
              <div className={`border rounded-lg p-4 bg-gradient-to-br ${daysColor.gradient}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 ${daysColor.iconBg} rounded-lg`}>
                    <Clock className={`w-5 h-5 ${daysColor.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{daysLeft} Days Left</h3>
                    <p className="text-sm text-gray-600">Out of 30 days</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`${daysColor.barColor} h-2 rounded-full transition-all`}
                    style={{ width: `${daysUsedPercentage}%` }}
                  />
                </div>
              </div>

              {/* Sessions Card - Apply dynamic colors based on sessions usage */}
              <div className={`border rounded-lg p-4 bg-gradient-to-br ${sessionsColor.gradient}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 ${sessionsColor.iconBg} rounded-lg`}>
                    <Activity className={`w-5 h-5 ${sessionsColor.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{sessionsLeft.toLocaleString()} Sessions Left</h3>
                    <p className="text-sm text-gray-600">
                      {sessionsUsed.toLocaleString()} of {totalSessions.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`${sessionsColor.barColor} h-2 rounded-full transition-all`}
                    style={{ width: `${sessionsUsedPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Important Notice</h4>
                <p className="text-sm text-red-700">
                  When your trial days or session limit is reached, <strong> all Link Protector traffic will be automatically
                  paused </strong> until you add a payment method.
                </p>
              </div>
            </div>

            {/* Pricing Calculator Section */}
            <div className="border rounded-lg p-5 bg-card">
              <button
                onClick={() => setShowPricing(!showPricing)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <h3 className="text-lg font-semibold">After Trial: Pricing Calculator</h3>
                  <p className="text-sm text-muted-foreground mt-1">See what you'll pay based on your usage</p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    showPricing ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPricing && (
                <div className="mt-5 space-y-5 border-t pt-5">
                  {/* Input Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Estimate your monthly cost</h4>

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

                      {/* Number Input */}
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={sessionCount}
                          onChange={handleInputChange}
                          className="text-base"
                          min={0}
                          max={150000}
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">sessions/month</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Output */}
                  <div className="rounded-lg bg-primary/5 p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--brand))]">
                        $
                        {monthlyTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        <span className="text-base font-normal text-muted-foreground"> / month</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {sessionCount.toLocaleString()} sessions × ${currentTier.rate.toFixed(2)} per session
                      </p>
                    </div>
                  </div>

                  {/* Interactive Pricing Table */}
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
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

                  <p className="text-xs text-muted-foreground text-center">
                    Billed monthly on the 1st. Cancel anytime.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleStopTrial} className="w-full sm:w-auto bg-transparent">
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Free Trial
            </Button>
            <Button onClick={handleAddCreditCard} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Credit Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Confirm Trial Cancellation
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to stop your free trial? All your Link Protectors will be immediately paused, and
              incoming traffic will be blocked until you reactivate your subscription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep My Trial</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Yes, Stop Trial
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
