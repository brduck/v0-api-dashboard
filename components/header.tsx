"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useUser()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <div className="w-full max-w-7xl mx-auto flex items-center">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dtect_blaco-qnuSaSRbJcOWGRm5vHxK6gKBa17icv.svg"
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
            API Usage{" "}
            {!user?.hasApiAccess && (
              <span className="ml-1 text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">Upgrade</span>
            )}
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
          {user && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)} Plan</span>
            </div>
          )}
          <Button variant="outline" className="hidden gap-2 md:flex" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
