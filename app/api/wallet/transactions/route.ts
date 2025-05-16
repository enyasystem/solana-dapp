import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
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

    // Get recent transactions
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 })

    // Get transaction details
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getParsedTransaction(sig.signature)

          // Basic transaction type detection
          let type = "Unknown"
          let amount = undefined
          let token = undefined
          let recipient = undefined

          if (tx?.transaction.message.instructions.length) {
            const instruction = tx.transaction.message.instructions[0]

            if ("parsed" in instruction && instruction.parsed.type) {
              type = instruction.parsed.type

              if (type === "transfer" && instruction.parsed.info) {
                amount = instruction.parsed.info.amount
                recipient = instruction.parsed.info.destination
                token = "SOL"
              }
            } else if (instruction.programId.toString() === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
              type = "SPL Token Transfer"
            }
          }

          return {
            signature: sig.signature,
            blockTime: sig.blockTime || 0,
            slot: sig.slot,
            type,
            status: sig.err ? "error" : "success",
            amount,
            token,
            recipient,
          }
        } catch (error) {
          console.error("Error parsing transaction:", error)
          return {
            signature: sig.signature,
            blockTime: sig.blockTime || 0,
            slot: sig.slot,
            type: "Unknown",
            status: "error",
          }
        }
      }),
    )

    return NextResponse.json({ transactions }, { status: 200 })
  } catch (error) {
    console.error("Failed to get transactions:", error)
    return NextResponse.json({ error: "Failed to get transactions" }, { status: 500 })
  }
}
