"use client"

import type React from "react"
import { createContext, useEffect, useState, useContext } from "react"
import { useRouter } from "next/navigation"
import { CivicAuth } from '@civic/auth-web3'

type User = {
  id: string
  email: string
  name?: string
  picture?: string
}

type CivicAuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  civicAuth: CivicAuth | null
  isReady: boolean
}

export const CivicAuthContext = createContext<CivicAuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  civicAuth: null,
  isReady: false,
})

// Simplified auth provider that works with Civic's actual exports
export function CivicAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [civicAuth, setCivicAuth] = useState<CivicAuth | null>(null)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for session in localStorage or cookies
        const storedUser = localStorage.getItem("civic_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const auth = new CivicAuth({})
    setCivicAuth(auth)
    setIsReady(true)
  }, [])

  const signIn = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would redirect to Civic's auth flow
      // For now, we'll simulate a successful login
      window.location.href = `/api/auth/civic-login?redirect=${encodeURIComponent(window.location.origin + "/dashboard")}`
    } catch (error) {
      console.error("Sign in failed:", error)
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("civic_user")
      setUser(null)

      // Call logout API
      await fetch("/api/auth/logout", { method: "POST" })

      router.push("/")
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  return (
    <CivicAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        civicAuth,
        isReady,
      }}
    >
      {children}
    </CivicAuthContext.Provider>
  )
}

export function useCivicAuth() {
  return useContext(CivicAuthContext)
}
