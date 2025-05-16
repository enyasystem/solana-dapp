"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCivicAuth } from "@/lib/auth/use-civic-auth"
import { useCivicAuth as useCivicAuthProvider } from "@/lib/auth/civic-provider"

export function CallToAction() {
  const { signIn, isLoading } = useCivicAuth()
  const { civicAuth, isReady } = useCivicAuthProvider()

  const handleLogin = async () => {
    if (!civicAuth) return
    try {
      await civicAuth.signIn()
      // Optionally, redirect or show a success message
    } catch (e) {
      // Handle error
      alert("Civic Auth login failed")
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Web3?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of users already enjoying the benefits of our Solana dApp. Get started in seconds with just
            your Google or Apple account.
          </p>
          <Button
            size="lg"
            onClick={signIn}
            disabled={isLoading}
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            {isLoading ? "Connecting..." : "Get Started Now"}
          </Button>
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              onClick={handleLogin}
              disabled={!isReady}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg hover:bg-primary/80 transition"
            >
              Sign in with Civic
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
