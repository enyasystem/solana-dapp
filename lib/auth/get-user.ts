import { cookies } from "next/headers"
import { getUserByEmail } from "@/lib/services/user-service"

export async function getUser() {
  // cookies() now returns a Promise<ReadonlyRequestCookies> in Next.js 14+
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session_token")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    // In a real implementation, you would verify the JWT token
    // For now, we'll just decode it to get the email
    const tokenParts = sessionCookie.value.split(".")
    if (tokenParts.length !== 3) {
      return null
    }

    const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString())
    const email = payload.email

    if (!email) {
      return null
    }

    // Get user from database
    const user = await getUserByEmail(email)

    return user
  } catch (error) {
    console.error("Failed to get user:", error)
    return null
  }
}
