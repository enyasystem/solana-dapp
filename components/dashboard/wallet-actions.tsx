"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet/use-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Wallet, Copy, ExternalLink, QrCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function WalletActions() {
  const { address } = useWallet()
  const { toast } = useToast()
  const [showQR, setShowQR] = useState(false)

  const copyAddress = () => {
    if (!address) return

    navigator.clipboard.writeText(address)
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const getExplorerUrl = () => {
    if (!address) return "#"
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "devnet"
    return `https://explorer.solana.com/address/${address}?cluster=${cluster}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Actions</CardTitle>
        <CardDescription>Manage your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild>
            <Link href="/dashboard/send">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setShowQR(!showQR)}>
            <QrCode className="h-4 w-4 mr-2" />
            {showQR ? "Hide QR" : "Show QR"}
          </Button>
        </div>

        {showQR && address && (
          <div className="flex justify-center py-2">
            <div className="bg-white p-2 rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`}
                alt="Wallet QR Code"
                width={150}
                height={150}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copyAddress} disabled={!address}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={() => window.open(getExplorerUrl(), "_blank")} disabled={!address}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Explorer
          </Button>
        </div>

        <Button variant="secondary" className="w-full" asChild>
          <Link href="/dashboard/wallet/backup">
            <Wallet className="h-4 w-4 mr-2" />
            Backup Wallet
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
