import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/get-user"
import { getWalletByUserId, getWalletKeypair } from "@/lib/services/wallet-service"
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"

export async function POST(request: Request) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipient, amount, token } = await request.json()

    if (!recipient || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
    }

    // Get user's wallet
    const wallet = await getWalletByUserId(user.id)

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    const keypair = await getWalletKeypair(user.id)

    if (!keypair) {
      return NextResponse.json({ error: "Failed to get wallet keypair" }, { status: 500 })
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com")

    const recipientPubkey = new PublicKey(recipient)

    let transaction: Transaction

    if (token === "SOL") {
      // Transfer SOL
      transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: recipientPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )
    } else {
      // Transfer SPL token
      const mintPubkey = new PublicKey(token)

      // Get token accounts
      const senderTokenAccount = await getAssociatedTokenAddress(mintPubkey, keypair.publicKey)

      const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey)

      // Check if recipient token account exists
      const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAccount)

      transaction = new Transaction()

      // Create recipient token account if it doesn't exist
      if (!recipientTokenAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            keypair.publicKey,
            recipientTokenAccount,
            recipientPubkey,
            mintPubkey,
          ),
        )
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          keypair.publicKey,
          amount * Math.pow(10, 9), // Assuming 9 decimals, adjust as needed
        ),
      )
    }

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair])

    return NextResponse.json({ success: true, signature }, { status: 200 })
  } catch (error) {
    console.error("Transfer failed:", error)
    return NextResponse.json({ error: "Transfer failed" }, { status: 500 })
  }
}
