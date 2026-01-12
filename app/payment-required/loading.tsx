import { Skeleton } from "@/components/ui/skeleton"

export default function PaymentRequiredLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-6 h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto h-12 w-96 mb-4" />
          <Skeleton className="mx-auto h-6 w-64" />
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
