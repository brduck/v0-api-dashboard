export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm bg-background border rounded-lg shadow-sm p-8 animate-pulse">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="h-8 bg-muted rounded w-32 mx-auto" />
            <div className="h-4 bg-muted rounded w-48 mx-auto" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded" />
            </div>
            <div className="h-11 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
