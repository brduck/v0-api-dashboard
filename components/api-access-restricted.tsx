import { Button } from "@/components/ui/button"

export function ApiAccessRestricted() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Usage</h1>
        </div>

        <div className="p-8 border rounded-lg bg-amber-50 border-amber-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-amber-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">API Access Not Available</h2>
            <p className="text-amber-700 mb-6">
              API access is not available on your current subscription. Please contact our sales team to learn more
              about our API offerings and how they can help your business.
            </p>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white border-0">
              Contact Sales About API Access
            </Button>
          </div>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-medium mb-6 text-center">API Features & Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <h4 className="text-lg font-medium">Seamless Integration</h4>
              </div>
              <p className="text-gray-600 ml-11">
                Integrate our powerful API with your existing systems and workflows. Our API is designed to work with
                your current tech stack, making implementation quick and hassle-free.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <h4 className="text-lg font-medium">Developer-Friendly</h4>
              </div>
              <p className="text-gray-600 ml-11">
                Comprehensive documentation, SDKs, and code examples for quick implementation. Our developer portal
                provides everything you need to get started and be successful.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-gray-50">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Ready to get started?</h3>
            <p className="text-gray-600 mb-4">
              Contact our sales team today to discuss how our API can help your business.
            </p>
            <Button className="bg-black text-white hover:bg-gray-800">Schedule a Demo</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
