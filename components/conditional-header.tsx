"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

/**
 * Renders the main application header everywhere
 * except on routes that start with "/terminate".
 */
export function ConditionalHeader() {
  const pathname = usePathname()

  // Hide header on the termination page (and any future sub-routes of /terminate)
  if (pathname.startsWith("/terminate")) {
    return null
  }

  return <Header />
}
