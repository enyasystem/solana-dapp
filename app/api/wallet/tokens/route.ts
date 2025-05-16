import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { getUser } from "@/lib/auth/get-user"

export async function GET(request: Request) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com")

    const publicKey = new PublicKey(address)

    // Get all token accounts for the address
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })

    // Format token balances
    const tokens = tokenAccounts.value.map((account) => {
      const accountData = account.account.data.parsed.info
      const mint = accountData.mint
      const balance = accountData.tokenAmount.amount
      const decimals = accountData.tokenAmount.decimals
      const uiBalance = accountData.tokenAmount.uiAmount

      return {
        mint,
        balance: Number(balance),
        decimals,
        uiBalance: uiBalance.toString(),
        symbol: "Unknown", // In a real app, you'd fetch token metadata to get symbols
      }
    })

    return NextResponse.json({ tokens }, { status: 200 })
  } catch (error) {
    console.error("Failed to get token balances:", error)
    return NextResponse.json({ error: "Failed to get token balances" }, { status: 500 })
  }
}
