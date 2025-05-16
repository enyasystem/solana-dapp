"use client"

import type React from "react"

import { useState } from "react"
import { useWallet } from "@/lib/wallet/use-wallet"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function TokenTransfer() {
  const { address, solBalance, tokenBalances } = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("SOL")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address || !recipient || !amount) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          amount: Number.parseFloat(amount),
          token,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Transfer successful",
          description: `Successfully sent ${amount} ${token} to ${recipient.slice(0, 8)}...`,
        })

        setRecipient("")
        setAmount("")
      } else {
        toast({
          title: "Transfer failed",
          description: data.error || "An error occurred during the transfer",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Transfer failed:", error)
      toast({
        title: "Transfer failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Tokens</CardTitle>
        <CardDescription>Transfer SOL or SPL tokens to another wallet</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Enter Solana wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger id="token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOL">SOL</SelectItem>
                {tokenBalances.map((t) => (
                  <SelectItem key={t.mint} value={t.mint}>
                    {t.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {token === "SOL" && <p className="text-xs text-muted-foreground">Available: {solBalance.toFixed(4)} SOL</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || !address}>
            {isLoading ? "Processing..." : "Send Tokens"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
