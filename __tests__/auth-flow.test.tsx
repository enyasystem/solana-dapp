import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LandingHero } from "@/components/landing/hero"
import { CivicAuthProvider } from "@/lib/auth/civic-provider"

// Mock the Civic Auth SDK
jest.mock("@civic/auth-web3", () => {
  return {
    CivicAuth: jest.fn().mockImplementation(() => {
      return {
        signIn: jest.fn(),
        getSession: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
    }),
    CivicAuthEvent: {
      LOGIN_SUCCESS: "login_success",
      LOGOUT: "logout",
    },
  }
})

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

describe("Authentication Flow", () => {
  it("renders the sign in button", () => {
    render(
      <CivicAuthProvider>
        <LandingHero />
      </CivicAuthProvider>,
    )

    const signInButton = screen.getByText("Sign in with Civic")
    expect(signInButton).toBeInTheDocument()
  })

  it("calls signIn when button is clicked", async () => {
    render(
      <CivicAuthProvider>
        <LandingHero />
      </CivicAuthProvider>,
    )

    const signInButton = screen.getByText("Sign in with Civic")
    fireEvent.click(signInButton)

    // Button should show loading state
    await waitFor(() => {
      expect(screen.getByText("Connecting...")).toBeInTheDocument()
    })
  })
})
