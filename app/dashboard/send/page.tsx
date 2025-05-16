import { TokenTransfer } from "@/components/dashboard/token-transfer"

export default function SendPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Send Tokens</h1>
        <p className="text-muted-foreground">Transfer SOL or SPL tokens to another wallet</p>
      </div>

      <div className="max-w-md mx-auto">
        <TokenTransfer />
      </div>
    </div>
  )
}
