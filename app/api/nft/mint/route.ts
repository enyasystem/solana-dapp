import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/get-user"
import { getWalletByUserId, getWalletKeypair } from "@/lib/services/wallet-service"
import { createNFT } from "@/lib/services/nft-service"
import { Connection } from "@solana/web3.js"

// Updated Metaplex imports
import { Metaplex } from "@metaplex-foundation/js"

export async function POST() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Updated Metaplex initialization
    const metaplex = Metaplex.make(connection).use({
      identity: { keypair },
      storage: { preferredStorage: "nftStorage" },
    })

    // In a real app, you'd upload the NFT metadata to Arweave or IPFS
    // For this example, we'll use a placeholder
    const { nft } = await metaplex.nfts().create({
      name: "Premium Access NFT",
      symbol: "PREMIUM",
      uri: "https://example.com/metadata.json", // Placeholder metadata URI
      sellerFeeBasisPoints: 0,
    })

    // Store the NFT in the database
    const createdNFT = await createNFT({
      userId: user.id,
      mint: nft.address.toString(),
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
    })

    return NextResponse.json(
      {
        success: true,
        mint: createdNFT.mint,
        name: createdNFT.name,
        symbol: createdNFT.symbol,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to mint NFT:", error)
    return NextResponse.json({ error: "Failed to mint NFT" }, { status: 500 })
  }
}
