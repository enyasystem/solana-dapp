"use client"

import { useWallet } from "@/lib/wallet/use-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function WalletOverview() {
  const { address, solBalance, tokenBalances, isLoading, refreshBalances } = useWallet()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Wallet Overview</CardTitle>
          <CardDescription>Your Solana wallet details</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={refreshBalances} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh balances</span>
        </Button>
      </CardHeader>
      <CardContent>
        {address ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Wallet Address</div>
              <div className="bg-muted p-2 rounded-md text-xs break-all">{address}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">SOL Balance</div>
              <div className="text-2xl font-bold">{solBalance.toFixed(4)} SOL</div>
            </div>

            {tokenBalances.length > 0 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Token Balances</div>
                <div className="space-y-2">
                  {tokenBalances.map((token) => (
                    <div key={token.mint} className="flex justify-between items-center">
                      <span>{token.symbol}</span>
                      <span className="font-medium">{token.uiBalance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Wallet loading or not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
