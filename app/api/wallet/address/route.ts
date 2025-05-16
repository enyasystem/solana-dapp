import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/get-user"
import { getWalletByUserId } from "@/lib/services/wallet-service"

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wallet = await getWalletByUserId(user.id)

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    return NextResponse.json({ address: wallet.publicKey }, { status: 200 })
  } catch (error) {
    console.error("Failed to get wallet address:", error)
    return NextResponse.json({ error: "Failed to get wallet address" }, { status: 500 })
  }
}
