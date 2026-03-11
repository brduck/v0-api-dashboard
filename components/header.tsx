"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <div className="w-full max-w-7xl mx-auto flex items-center">
        <div className="flex items-center">
          <Image
            src="/images/design-mode/dtect_blaco.svg"
            alt="dtect logo"
            width={100}
            height={40}
            className="mx-auto"
            priority
          />
        </div>
        <nav className="hidden md:flex md:items-center md:gap-6 ml-10">
          <Link
            href="/link-protectors"
            className={`text-sm font-medium ${pathname.startsWith("/link-protector") || pathname === "/link-protectors" || pathname.startsWith("/protector") ? "text-black" : "text-gray-500"}`}
          >
            Link Protector
          </Link>
          <Link
            href="/usage"
            className={`text-sm font-medium ${pathname === "/usage" ? "text-black" : "text-gray-500"}`}
          >
            Detection
          </Link>

          <Link
            href="/settings"
            className={`text-sm font-medium ${pathname.startsWith("/settings") ? "text-black" : "text-gray-500"}`}
          >
            Settings
          </Link>
          <Link href="https://docs.dtect.io/" className="text-sm font-medium text-gray-500">
            Docs
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" className="hidden gap-2 md:flex bg-transparent">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
