"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

/**
 * Renders the main application header everywhere
 * except on routes that start with "/terminate", "/sign-in", or "/sign-up".
 */
export function ConditionalHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/terminate") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null
  }

  return <Header />
}
