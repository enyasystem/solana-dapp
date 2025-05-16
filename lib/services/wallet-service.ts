import { executeQuery } from "../db"
import { v4 as uuidv4 } from "uuid"
import * as bip39 from "bip39"
import { Keypair } from "@solana/web3.js"
import { derivePath } from "ed25519-hd-key"

export type Wallet = {
  id: string
  userId: string
  publicKey: string
  encryptedPrivateKey: string
  encryptedMnemonic: string
  createdAt: Date
  updatedAt: Date
}

export async function getWalletByUserId(userId: string): Promise<Wallet | null> {
  const result = await executeQuery('SELECT * FROM "Wallet" WHERE "userId" = $1 LIMIT 1', [userId])

  return result.length > 0 ? result[0] : null
}

export async function createWallet(userId: string): Promise<Wallet> {
  // Check if wallet already exists
  const existingWallet = await getWalletByUserId(userId)
  if (existingWallet) {
    return existingWallet
  }

  // Generate a new wallet
  const mnemonic = bip39.generateMnemonic()
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.slice(0, 32)).key
  const keypair = Keypair.fromSeed(derivedSeed)

  // In a real app, you would encrypt these values
  const encryptedPrivateKey = Buffer.from(keypair.secretKey).toString("base64")

  const id = uuidv4()
  const now = new Date()

  const result = await executeQuery(
    'INSERT INTO "Wallet" (id, "userId", "publicKey", "encryptedPrivateKey", "encryptedMnemonic", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [id, userId, keypair.publicKey.toString(), encryptedPrivateKey, mnemonic, now, now],
  )

  return result[0]
}

export async function getWalletKeypair(userId: string): Promise<Keypair | null> {
  const wallet = await getWalletByUserId(userId)
  if (!wallet) return null

  // In a real app, you would decrypt the private key
  const privateKeyBytes = Buffer.from(wallet.encryptedPrivateKey, "base64")
  return Keypair.fromSecretKey(privateKeyBytes)
}
