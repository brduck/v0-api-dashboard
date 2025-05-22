import { ApiAccessRestricted } from "@/components/api-access-restricted"

export default function UsagePage() {
  // This is a simplified example - in a real app, you would check user permissions
  // from a server component or client component with proper authentication
  const hasApiAccess = false // Set to false for first-time users

  if (!hasApiAccess) {
    return <ApiAccessRestricted />
  }

  // Original content below
  return (
    <div>
      <h1>Usage Page</h1>
      <p>Welcome to the usage page!</p>
    </div>
  )
}
