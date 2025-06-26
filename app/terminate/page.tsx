import { AlertTriangle } from "lucide-react"

export default function TerminatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Sorry, you can't continue</h1>

          <p className="text-gray-600 mb-6 text-center">You weren't able to continue because access to this page was restricted.</p>
            <h2 className="font-semibold text-gray-900 mb-3">Possible reasons include:</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                You didn't meet the requirements for participation.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The link has expired or is no longer in use.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
