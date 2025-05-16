"use client"

import { useContext } from "react"
import { CivicAuthContext } from "./civic-provider"

export function useCivicAuth() {
  const context = useContext(CivicAuthContext)

  if (context === undefined) {
    throw new Error("useCivicAuth must be used within a CivicAuthProvider")
  }

  return context
}
