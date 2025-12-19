"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

/**
 * Renders the main application header everywhere
 * except on routes that start with "/terminate" or "/sign-in".
 */
export function ConditionalHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/terminate") || pathname.startsWith("/sign-in")) {
    return null
  }

  return <Header />
}
