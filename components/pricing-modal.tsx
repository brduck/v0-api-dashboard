"use client"

import { Check, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Your free trial is ending soon. Choose a plan to continue using all features.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-lg">Standard Pricing</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold">$0.60</span>
              <span className="text-gray-500 ml-2">per participant</span>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Unlimited link protectors</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-lg text-blue-700">Get a Custom Discount</h3>
            <p className="mt-1 text-blue-600">
              Contact our sales team to get a customized plan with significant discounts based on your volume.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Mail className="h-4 w-4" />
                Contact Sales
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            By upgrading, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
