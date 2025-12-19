"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const emailProviders = [
    { name: "Gmail", url: "https://mail.google.com" },
    { name: "Outlook", url: "https://outlook.live.com" },
    { name: "Yahoo", url: "https://mail.yahoo.com" },
  ]

  if (submitted) {
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

        {/* Success Card */}
        <div className="w-full max-w-md bg-background border rounded-lg shadow-sm p-8">
          <div className="space-y-6 text-center">
            {/* Mail Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            {/* Inbox Shortcuts */}
            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">Open your inbox:</p>
              <div className="grid gap-2">
                {emailProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open(provider.url, "_blank")}
                  >
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Back to Sign In */}
            <div className="pt-4 border-t">
              <a href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    )
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

      {/* Sign Up Card */}
      <div className="w-full max-w-sm bg-background border rounded-lg shadow-sm p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your information to get started.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10"
                required
              />
            </div>

            {/* Company Name Field */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium">
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Acme Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-10"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Company Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 bg-foreground text-background hover:bg-foreground/90">
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <a href="/sign-in" className="font-medium text-foreground hover:underline transition-colors">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
