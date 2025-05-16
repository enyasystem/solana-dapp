"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { useCivicAuth } from "@/lib/auth/use-civic-auth"

type TokenBalance = {
  mint: string
  symbol: string
  balance: number
  decimals: number
  uiBalance: string
}

type WalletContextType = {
  address: string | null
  solBalance: number
  tokenBalances: TokenBalance[]
  isLoading: boolean
  refreshBalances: () => Promise<void>
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  solBalance: 0,
  tokenBalances: [],
  isLoading: false,
  refreshBalances: async () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useCivicAuth()
  const [address, setAddress] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState(0)
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWalletAddress()
    } else {
      setAddress(null)
      setSolBalance(0)
      setTokenBalances([])
    }
  }, [isAuthenticated, user])

  const fetchWalletAddress = async () => {
    try {
      const response = await fetch("/api/wallet/address")
      const data = await response.json()

      if (data.address) {
        setAddress(data.address)
        refreshBalances()
      }
    } catch (error) {
      console.error("Failed to fetch wallet address:", error)
    }
  }

  const refreshBalances = async () => {
    if (!address) return

    setIsLoading(true)

    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com")

      // Fetch SOL balance
      const publicKey = new PublicKey(address)
      const balance = await connection.getBalance(publicKey)
      setSolBalance(balance / 1e9) // Convert lamports to SOL

      // Fetch SPL token balances
      const response = await fetch(`/api/wallet/tokens?address=${address}`)
      const data = await response.json()

      if (data.tokens) {
        setTokenBalances(data.tokens)
      }
    } catch (error) {
      console.error("Failed to refresh balances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        solBalance,
        tokenBalances,
        isLoading,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
