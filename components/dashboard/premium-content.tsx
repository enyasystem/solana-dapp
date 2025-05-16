"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/lib/wallet/use-wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PremiumContent() {
  const { address } = useWallet()
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMinting, setIsMinting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function checkAccess() {
      if (!address) {
        setHasAccess(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/nft/check-access")
        const data = await response.json()

        setHasAccess(data.hasAccess)
      } catch (error) {
        console.error("Failed to check NFT access:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [address])

  const handleMintNFT = async () => {
    if (!address) return

    setIsMinting(true)

    try {
      const response = await fetch("/api/nft/mint", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setHasAccess(true)
        toast({
          title: "NFT Minted Successfully",
          description: `You now have access to premium content!`,
        })
      } else {
        throw new Error(data.error || "Failed to mint NFT")
      }
    } catch (error) {
      console.error("Failed to mint NFT:", error)
      toast({
        title: "Failed to mint NFT",
        description: "An error occurred while minting your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 animate-pulse">
            <Lock className="h-5 w-5 text-primary" />
            Premium Content
          </CardTitle>
          <CardDescription>Loading access status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasAccess) {
    return (
      <Card className="shadow-xl border-2 border-destructive/30 bg-gradient-to-br from-background to-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Lock className="h-5 w-5" />
            Premium Content Locked
          </CardTitle>
          <CardDescription>Mint an NFT to unlock exclusive premium content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This content is exclusively available to NFT holders. Mint your access NFT to unlock advanced Solana
            development guides, tutorials, and resources.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleMintNFT} disabled={isMinting || !address} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:from-secondary hover:to-primary transition-all duration-200">
            {isMinting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Minting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Mint Access NFT
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="shadow-2xl border-2 border-primary/40 bg-gradient-to-br from-background to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Lock className="h-5 w-5" />
            Premium Content
          </CardTitle>
          <CardDescription>Exclusive content for NFT holders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Advanced Solana Development Strategies</h3>
            <p>
              This exclusive guide covers advanced techniques for building high-performance Solana applications,
              optimizing transaction throughput, and implementing complex smart contract patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4 border border-primary/10 shadow-sm">
                <h4 className="font-medium mb-2 text-primary">Performance Optimization</h4>
                <p className="text-sm">Learn how to structure your transactions for maximum throughput</p>
              </div>
              <div className="bg-muted rounded-lg p-4 border border-primary/10 shadow-sm">
                <h4 className="font-medium mb-2 text-primary">Security Best Practices</h4>
                <p className="text-sm">Implement robust security measures to protect user assets</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-primary">Solana Program Development</h3>
              <p className="mb-4">
                Dive deep into Solana program development with these exclusive code examples and tutorials.
              </p>

              <div className="bg-black/90 text-white p-4 rounded-md font-mono text-sm overflow-x-auto border border-primary/20 shadow-inner">
                <pre>{`// Example Solana program for token transfers\nuse solana_program::{\n    account_info::{next_account_info, AccountInfo},\n    entrypoint,\n    entrypoint::ProgramResult,\n    program_error::ProgramError,\n    pubkey::Pubkey,\n    msg,\n};\n\nentrypoint!(process_instruction);\n\nfn process_instruction(\n    program_id: &Pubkey,\n    accounts: &[AccountInfo],\n    instruction_data: &[u8],\n) -> ProgramResult {\n    let accounts_iter = &mut accounts.iter();\n    \n    let source = next_account_info(accounts_iter)?;\n    let destination = next_account_info(accounts_iter)?;\n    \n    // Transfer logic here\n    \n    msg!(\"Transfer completed successfully\");\n    Ok(())\n}`}</pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
