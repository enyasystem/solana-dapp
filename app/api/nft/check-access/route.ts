import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth/get-user"
import { checkUserOwnsNFT } from "@/lib/services/nft-service"

export async function GET() {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const hasAccess = await checkUserOwnsNFT(user.id)

    return NextResponse.json({ hasAccess }, { status: 200 })
  } catch (error) {
    console.error("Failed to check NFT access:", error)
    return NextResponse.json({ error: "Failed to check NFT access" }, { status: 500 })
  }
}
