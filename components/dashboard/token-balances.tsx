"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet/use-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function TokenBalances() {
  const { tokenBalances, isLoading, refreshBalances } = useWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalances()
    setIsRefreshing(false)
  }

  const getExplorerUrl = (mint: string) => {
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet"
    return `https://explorer.solana.com/address/${mint}?cluster=${cluster}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Token Balances</CardTitle>
          <CardDescription>Your SPL token holdings</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh balances</span>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : tokenBalances.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenBalances.map((token) => (
                <TableRow key={token.mint}>
                  <TableCell className="font-medium">{token.symbol}</TableCell>
                  <TableCell>{token.uiBalance}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => window.open(getExplorerUrl(token.mint), "_blank")}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No tokens found in your wallet</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
