import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Providers } from "@/components/providers"
import { ConditionalHeader } from "@/components/conditional-header"
import { TestSettingsPanel } from "@/components/test-settings-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "dtect API Dashboard",
  description: "Security monitoring dashboard",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-white">
            <ConditionalHeader />
            <main className="flex-1">{children}</main>
            <TestSettingsPanel />
          </div>
        </Providers>
      </body>
    </html>
  )
}
