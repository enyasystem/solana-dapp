"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Shield, Key, Layers } from "lucide-react"

const features = [
  {
    title: "Embedded Wallets",
    description: "Seamlessly create and manage your Solana wallet without any technical knowledge.",
    icon: Wallet,
  },
  {
    title: "Secure Authentication",
    description: "Sign in with your Google or Apple account through Civic's secure authentication.",
    icon: Shield,
  },
  {
    title: "Token Transfers",
    description: "Send and receive SOL and SPL tokens with a simple, intuitive interface.",
    icon: Key,
  },
  {
    title: "NFT-Gated Content",
    description: "Access exclusive premium content by minting and holding our NFTs.",
    icon: Layers,
  },
]

export function Features() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our Solana dApp provides a seamless Web3 experience with these powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
