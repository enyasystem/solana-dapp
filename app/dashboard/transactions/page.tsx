import { TransactionHistory } from "@/components/dashboard/transaction-history"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">View your recent Solana transactions</p>
      </div>

      <TransactionHistory />
    </div>
  )
}
