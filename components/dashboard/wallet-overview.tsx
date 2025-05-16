"use client"

import { useWallet } from "@/lib/wallet/use-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Jazzicon, { jsNumberForAddress } from "react-jazzicon"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { useState } from "react"

export function WalletOverview() {
  const { address, solBalance, tokenBalances, isLoading, refreshBalances } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast({
        title: "Wallet address copied!",
        description: address,
      })
      setTimeout(() => setCopied(false), 1200)
    }
  }

  if (isLoading) {
    // Loading skeleton
    return (
      <Card className="shadow-lg border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5 animate-pulse">
        <CardHeader>
          <CardTitle className="text-primary">Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!address) {
    return (
      <Card className="shadow-lg border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Wallet Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No wallet connected.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        key={address}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-xl border-2 border-primary/40 bg-gradient-to-br from-background to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-primary flex items-center gap-2">
                Wallet Overview
              </CardTitle>
              <CardDescription>Your Solana wallet details</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={refreshBalances} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh balances</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded select-all cursor-pointer border border-primary/20" tabIndex={0} title={address}>
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="font-mono text-xs">{address}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button size="icon" variant="ghost" onClick={handleCopy} title="Copy address" className="relative">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-primary" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">SOL Balance:</span>
                <span className="ml-2 font-bold text-2xl text-primary flex items-center gap-1">
                  <img src="/solana-logo.svg" alt="SOL" className="h-5 w-5 inline-block" />
                  {solBalance.toFixed(4)} <span className="text-base font-normal ml-1">SOL</span>
                </span>
              </div>
              {tokenBalances.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Token Balances</div>
                  <div className="space-y-2">
                    {tokenBalances.map((token) => (
                      <div key={token.mint} className="flex justify-between items-center bg-muted/40 rounded px-2 py-1">
                        <span className="flex items-center gap-2">
                          {/* Fallback icon for tokens */}
                          <img src="/placeholder-logo.svg" alt={token.symbol} className="h-4 w-4 rounded-full" />
                          {token.symbol}
                        </span>
                        <span className="font-medium">{token.uiBalance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
