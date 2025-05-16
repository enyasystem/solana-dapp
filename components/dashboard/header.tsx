"use client"

import { useCivicAuth } from "@/lib/auth/use-civic-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

type User = {
  id: string
  email: string
  name?: string
  picture?: string
}

export function DashboardHeader({ user }: { user: User }) {
  const { signOut } = useCivicAuth()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user.picture || ""} alt={user.name || "User"} />
          <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name || user.email.split("@")[0]}</h1>
          <p className="text-muted-foreground">Manage your wallet and access premium content</p>
        </div>
      </div>
      <Button variant="outline" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
