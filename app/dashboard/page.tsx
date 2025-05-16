import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/get-user"
import { DashboardHeader } from "@/components/dashboard/header"
import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { TokenTransfer } from "@/components/dashboard/token-transfer"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { PremiumContent } from "@/components/dashboard/premium-content"

export default async function Dashboard() {
  const user = await getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <WalletOverview />
        <TokenTransfer />
      </div>
      <div className="mt-8">
        <TransactionHistory />
      </div>
      <div className="mt-8">
        <PremiumContent />
      </div>
    </div>
  )
}
