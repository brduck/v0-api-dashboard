"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SubscriptionTier = "basic" | "premium" | "enterprise"

interface User {
  id: string
  name: string
  email: string
  subscriptionTier: SubscriptionTier
  hasApiAccess: boolean
  isFirstTimeUser: boolean
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Simulate loading user data
  useEffect(() => {
    const loadUser = () => {
      // Check if we have a user in localStorage
      const storedUser = localStorage.getItem("dtect_user")

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // For demo purposes, create a default "first time" user with basic subscription
        const newUser: User = {
          id: crypto.randomUUID(),
          name: "Demo User",
          email: "demo@example.com",
          subscriptionTier: "basic",
          hasApiAccess: false,
          isFirstTimeUser: true,
        }

        localStorage.setItem("dtect_user", JSON.stringify(newUser))
        setUser(newUser)
      }

      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = () => {
    // For demo purposes, just update the user to have API access
    if (user) {
      const updatedUser = {
        ...user,
        subscriptionTier: "enterprise" as SubscriptionTier,
        hasApiAccess: true,
        isFirstTimeUser: false,
      }
      localStorage.setItem("dtect_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const logout = () => {
    localStorage.removeItem("dtect_user")
    setUser(null)
  }

  return <UserContext.Provider value={{ user, isLoading, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
