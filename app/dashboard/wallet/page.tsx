import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { TokenBalances } from "@/components/dashboard/token-balances"
import { WalletActions } from "@/components/dashboard/wallet-actions"

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your Solana wallet and tokens</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WalletOverview />
        </div>
        <div>
          <WalletActions />
        </div>
      </div>

      <TokenBalances />
    </div>
  )
}
