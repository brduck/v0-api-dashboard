"use client"

import { X } from "lucide-react"
// Update the import path if needed
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-0 right-0 p-4 z-50 flex flex-col items-end">
      {toasts.map((toast, index) => (
        <div key={index} className="bg-white border rounded-md shadow-md p-4 mb-2 max-w-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              <p className="text-sm text-gray-500">{toast.description}</p>
            </div>
            <button
              onClick={() => dismiss(index)}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
