"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar" // Using the shadcn sidebar component [^1]
import { Home, Wallet, History, Send, FileText, Settings, HelpCircle, User } from "lucide-react"
import { useWallet } from "@/lib/wallet/use-wallet"
import { useCivicAuth } from "@/lib/auth/use-civic-auth"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { address } = useWallet()
  const { user } = useCivicAuth()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Transactions", href: "/dashboard/transactions", icon: History },
    { name: "Send Tokens", href: "/dashboard/send", icon: Send },
    { name: "Premium Content", href: "/dashboard/premium", icon: FileText },
  ]

  const bottomNavItems = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="p-2">
          <h2 className="text-xl font-bold">Solana dApp</h2>
          {address && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {address.slice(0, 8)}...{address.slice(-8)}
            </p>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive(item.href)}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/profile">
                <User className="h-4 w-4" />
                <span>{user?.name || user?.email?.split("@")[0] || "Profile"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
