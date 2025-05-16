"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCivicAuth } from "@/lib/auth/use-civic-auth"

export function LandingHero() {
  const { signIn, isLoading } = useCivicAuth()

  return (
    <div className="w-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-400">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Gateway to Web3
        </motion.h1>
        <motion.p
          className="text-xl text-white/90 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Experience the future of decentralized applications with our seamless Solana integration, embedded wallets,
          and exclusive NFT-gated content.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={signIn}
            disabled={isLoading}
            className="bg-white text-purple-600 hover:bg-white/90"
          >
            {isLoading ? "Connecting..." : "Sign in with Civic"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
