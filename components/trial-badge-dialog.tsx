"use client"

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
import { Clock, AlertTriangle, CreditCard, StopCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function TrialBadgeDialog() {
  const router = useRouter()
  const [showTrialDialog, setShowTrialDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Mock data - replace with actual data from your backend
  const daysLeft = 12
  const sessionsUsed = 3450
  const totalSessions = 25000
  const sessionsLeft = totalSessions - sessionsUsed
  const sessionsPercentage = (sessionsUsed / totalSessions) * 100

  const handleStopTrial = () => {
    setShowTrialDialog(false)
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    // Handle trial cancellation logic here
    console.log("Trial cancelled")
    setShowCancelDialog(false)
  }

  const handleAddCreditCard = () => {
    router.push("/onboarding/activate-trial")
    setShowTrialDialog(false)
  }

  return (
    <>
      <Badge
        variant="outline"
        className="cursor-pointer hover:bg-gray-100 transition-colors border-amber-500 text-amber-700 bg-amber-50"
        onClick={() => setShowTrialDialog(true)}
      >
        <Clock className="w-3 h-3 mr-1" />
        {daysLeft} days left
      </Badge>

      <Dialog open={showTrialDialog} onOpenChange={setShowTrialDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Free Trial Status</DialogTitle>
            <DialogDescription>Track your trial progress and manage your subscription</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Days Left Card */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{daysLeft} Days Remaining</h3>
                  <p className="text-sm text-gray-600">Out of 14-day free trial</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${((14 - daysLeft) / 14) * 100}%` }}
                />
              </div>
            </div>

            {/* Sessions Card */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <StopCircle className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{sessionsLeft.toLocaleString()} Sessions Left</h3>
                  <p className="text-sm text-gray-600">
                    {sessionsUsed.toLocaleString()} of {totalSessions.toLocaleString()} used
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${sessionsPercentage}%` }}
                />
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900 mb-1">Important Notice</h4>
                <p className="text-sm text-red-700">
                  When your trial days or session limit is reached, all Link Protector traffic will be automatically
                  paused until you add a payment method.
                </p>
              </div>
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
