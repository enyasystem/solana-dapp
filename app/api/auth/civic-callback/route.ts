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

    // In a real implementation, this would exchange the code for a token with Civic
    // For now, we'll create a mock user
    const mockEmail = `user-${code.slice(0, 8)}@example.com`

    // Check if user exists
    let user = await getUserByEmail(mockEmail)

    // Create user if not exists
    if (!user) {
      user = await createUser({
        email: mockEmail,
        name: `Test User ${mockEmail.slice(0, 5)}`,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockEmail}`,
      })

      // Create wallet for new user
      await createWallet(user.id)
    }

    // Create a simple JWT token
    const token = createMockJwt({
      sub: user.id,
      email: user.email,
      name: user.name || undefined,
    })

    // Set session cookie (cookies() is synchronous for setting)
    cookies().set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

// Simple mock JWT implementation
function createMockJwt(payload: any) {
  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64").replace(/=/g, "")
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64").replace(/=/g, "")

  // In a real implementation, you would sign this with a secret
  const signature = Buffer.from("mock-signature").toString("base64").replace(/=/g, "")

  return `${encodedHeader}.${encodedPayload}.${signature}`
}
