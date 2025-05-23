"use client"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()

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
        <div className="ml-auto flex items-center gap-4">
          <Button className="hidden gap-2 md:flex">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      </div>
    </header>
  )
}
