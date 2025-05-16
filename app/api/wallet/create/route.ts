import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/get-user"
import { createWallet, getWalletByUserId } from "@/lib/services/wallet-service"
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

export async function POST() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has a wallet
    const existingWallet = await getWalletByUserId(user.id)

    if (existingWallet) {
      return NextResponse.json({ message: "Wallet already exists" }, { status: 200 })
    }

    // Create a new wallet
    const wallet = await createWallet(user.id)

    // Airdrop some SOL on devnet for testing
    if (process.env.SOLANA_CLUSTER === "devnet") {
      const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com")

      try {
        await connection.requestAirdrop(
          new PublicKey(wallet.publicKey),
          2 * LAMPORTS_PER_SOL, // 2 SOL
        )
      } catch (airdropError) {
        console.error("Airdrop failed:", airdropError)
        // Continue even if airdrop fails
      }
    }

    return NextResponse.json({ success: true, address: wallet.publicKey }, { status: 201 })
  } catch (error) {
    console.error("Failed to create wallet:", error)
    return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 })
  }
}
