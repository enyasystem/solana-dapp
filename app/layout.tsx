import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CivicAuthProvider } from "@/lib/auth/civic-provider"
import { WalletProvider } from "@/lib/wallet/wallet-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Solana dApp",
  description: "A production-ready Solana dApp with authentication and embedded wallets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CivicAuthProvider>
            <WalletProvider>{children}</WalletProvider>
          </CivicAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
