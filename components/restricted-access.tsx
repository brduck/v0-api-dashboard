import { ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RestrictedAccess() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
          <Mail className="h-8 w-8 text-gray-500" />
        </div>

        <h2 className="text-2xl font-bold">API Access Not Available</h2>

        <p className="text-gray-600">
          The API functionality is not available on your current subscription plan. The dtect API allows you to
          integrate our security features directly into your applications.
        </p>

        <div className="bg-gray-50 border rounded-lg p-4 text-left">
          <h3 className="font-medium mb-2">With the dtect API you can:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <span>Integrate security checks directly into your applications</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <span>Access real-time security scoring for participants</span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <span>Automate security validation in your workflow</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/link-protectors">Return to Link Protectors</Link>
          </Button>
          <Button className="flex-1 bg-black text-white hover:bg-gray-800">
            Contact Sales <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
