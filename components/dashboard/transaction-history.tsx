"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet/use-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

type Transaction = {
  signature: string
  blockTime: number
  slot: number
  type: string
  status: "success" | "error"
  amount?: string
  token?: string
  recipient?: string
}

export function TransactionHistory() {
  const { address } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (address) {
      fetchTransactions()
    }
  }, [address])

  const fetchTransactions = async () => {
    if (!address) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/wallet/transactions?address=${address}`)
      const data = await response.json()

      if (data.transactions) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getExplorerUrl = (signature: string) => {
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet"
    return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent transactions from your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.signature}>
                  <TableCell>{formatDate(tx.blockTime)}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{tx.amount && tx.token ? `${tx.amount} ${tx.token}` : "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(tx.signature), "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
