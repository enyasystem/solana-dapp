import { executeQuery } from "../db"
import { v4 as uuidv4 } from "uuid"

export type NFT = {
  id: string
  userId: string
  mint: string
  name: string
  symbol?: string | null
  uri?: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getNFTsByUserId(userId: string): Promise<NFT[]> {
  const result = await executeQuery('SELECT * FROM "NFT" WHERE "userId" = $1', [userId])

  return result
}

export async function getNFTByMint(mint: string): Promise<NFT | null> {
  const result = await executeQuery('SELECT * FROM "NFT" WHERE mint = $1 LIMIT 1', [mint])

  return result.length > 0 ? result[0] : null
}

export async function createNFT(nftData: {
  userId: string
  mint: string
  name: string
  symbol?: string
  uri?: string
}): Promise<NFT> {
  const id = uuidv4()
  const now = new Date()

  const result = await executeQuery(
    'INSERT INTO "NFT" (id, "userId", mint, name, symbol, uri, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [id, nftData.userId, nftData.mint, nftData.name, nftData.symbol || null, nftData.uri || null, now, now],
  )

  return result[0]
}

export async function checkUserOwnsNFT(userId: string): Promise<boolean> {
  const nfts = await getNFTsByUserId(userId)
  return nfts.length > 0
}
