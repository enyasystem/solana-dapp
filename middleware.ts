import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/api/wallet", "/api/nft"]

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Get the session token from cookies
  const sessionToken = request.cookies.get("session_token")?.value

  // If the route is protected and there's no session token, redirect to login
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/?error=unauthorized", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/api/wallet/:path*", "/api/nft/:path*"],
}
