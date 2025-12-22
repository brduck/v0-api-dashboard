"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/onboarding/activate-trial")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* dtect Logo */}
      <div className="mb-8">
        <Image
          src="/images/design-mode/dtect_blaco.svg"
          alt="dtect logo"
          width={182}
          height={40}
          className="mx-auto"
          priority
        />
      </div>

      {/* Sign In Card */}
      <div className="w-full max-w-sm bg-background border rounded-lg shadow-sm p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">Enter your email and password to log in.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="alma.lawsonm@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 bg-foreground text-background hover:bg-foreground/90">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <a href="/sign-up" className="font-medium text-foreground hover:underline transition-colors">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
