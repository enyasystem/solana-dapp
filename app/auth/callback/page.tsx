"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")

        if (!code) {
          throw new Error("No authorization code found")
        }

        // Call our API endpoint
        const response = await fetch(`/api/auth/civic-callback?code=${code}`)

        if (!response.ok) {
          throw new Error("Authentication failed")
        }

        router.push("/dashboard")
      } catch (error) {
        console.error("Auth callback failed:", error)
        router.push("/?error=auth_failed")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h1 className="mt-4 text-xl font-semibold">Completing authentication...</h1>
        <p className="text-muted-foreground">Please wait while we set up your account</p>
      </div>
    </div>
  )
}
