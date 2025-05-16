import { PremiumContent } from "@/components/dashboard/premium-content"

export default function PremiumPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Premium Content</h1>
        <p className="text-muted-foreground">Exclusive content for NFT holders</p>
      </div>

      <PremiumContent />
    </div>
  )
}
