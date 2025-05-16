import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, createUser } from "@/lib/services/user-service"
import { createWallet } from "@/lib/services/wallet-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // Exchange code for Civic Auth token and user info
    const CIVIC_CLIENT_ID = process.env.CIVIC_CLIENT_ID as string
    const CIVIC_CLIENT_SECRET = process.env.CIVIC_CLIENT_SECRET as string
    const CALLBACK_URL = process.env.CIVIC_CALLBACK_URL as string || `${new URL(request.url).origin}/api/auth/civic-callback`

    const tokenRes = await fetch("https://auth.civic.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CIVIC_CLIENT_ID,
        client_secret: CIVIC_CLIENT_SECRET,
        redirect_uri: CALLBACK_URL,
      }),
    })
    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 500 })
    }
    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    // Get user info from Civic
    const userRes = await fetch("https://auth.civic.com/oauth/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!userRes.ok) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 })
    }
    const userInfo = await userRes.json()
    const email = userInfo.email
    const name = userInfo.name || email
    const wallet = userInfo.wallet_address
    if (!email) {
      return NextResponse.json({ error: "No email returned from Civic" }, { status: 500 })
    }

    // Check if user exists
    let user = await getUserByEmail(email)
    if (!user) {
      user = await createUser({
        email,
        name,
        picture: userInfo.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      })
      // Create wallet for new user (store Civic wallet address if needed)
      await createWallet(user.id)
    }

    // Set session cookie using the Response API
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.set("session_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
    return response
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
