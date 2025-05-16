"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Eye, EyeOff, Download, Copy, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function WalletBackupPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [mnemonic, setMnemonic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const { toast } = useToast()

  const handleReveal = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call to get the encrypted mnemonic
      // and decrypt it with the password
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This is a mock mnemonic - in a real app, this would be fetched from the server
      setMnemonic("abandon ability able about above absent absorb abstract absurd abuse access accident")
      setIsRevealed(true)
    } catch (error) {
      toast({
        title: "Failed to reveal recovery phrase",
        description: "An error occurred while retrieving your recovery phrase",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mnemonic)
    toast({
      title: "Copied to clipboard",
      description: "Recovery phrase copied to clipboard",
    })
  }

  const downloadMnemonic = () => {
    const element = document.createElement("a")
    const file = new Blob([mnemonic], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "solana-wallet-recovery-phrase.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Backup Wallet</h1>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your recovery phrase is the only way to recover your wallet if you lose access. Keep it in a safe place and
          never share it with anyone.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Phrase</CardTitle>
          <CardDescription>Enter a password to reveal your 12-word recovery phrase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isRevealed ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to reveal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mnemonic">Recovery Phrase</Label>
                  <Button variant="ghost" size="sm" onClick={() => setShowMnemonic(!showMnemonic)}>
                    {showMnemonic ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </div>

                {showMnemonic ? (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono break-all">{mnemonic}</p>
                  </div>
                ) : (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono">••••••••••••••••••••••••••••••••••••••••••••••••••••••••</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="flex-1" onClick={downloadMnemonic}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Important</AlertTitle>
                <AlertDescription className="text-green-700">
                  Write down these words in the correct order and store them in a safe place.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        {!isRevealed && (
          <CardFooter>
            <Button className="w-full" onClick={handleReveal} disabled={!password || !confirmPassword || isLoading}>
              {isLoading ? "Loading..." : "Reveal Recovery Phrase"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
