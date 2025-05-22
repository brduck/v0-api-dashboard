import { Button } from "@/components/ui/button"

export function ApiAccessRestricted() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] max-w-2xl mx-auto text-center p-6">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-amber-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">API Access Not Available</h2>
      <p className="text-gray-600 mb-6">
        API access is not available on your current subscription. Our API allows you to integrate dtect's powerful
        protection features directly into your applications.
      </p>
      <div className="bg-white border rounded-lg p-6 w-full mb-6">
        <h3 className="text-lg font-medium mb-4">API Features</h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Programmatic link protection</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Real-time threat detection</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Advanced analytics and reporting</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Webhook integrations</span>
          </li>
        </ul>
      </div>
      <Button className="bg-black text-white hover:bg-gray-800">Contact Sales About API Access</Button>
    </div>
  )
}
