"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Plane, Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/user-menu"
import type { Session } from 'next-auth'

const routes = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Solicitudes",
    href: "/solicitudes",
    icon: Plane,
  },
  {
    name: "Itinerarios",
    href: "/itinerarios",
    icon: Map,
  },
]

interface AdminNavProps {
  session?: Session | null
}

export function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname()

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <header className="dark sticky top-0 z-40 bg-sidebar text-sidebar-foreground">
      <div className="h-1 airmail-stripe" />
      <div className="flex h-16 items-stretch justify-between px-4 sm:px-6">
        <div className="flex items-stretch gap-6 sm:gap-8 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <Plane className="h-5 w-5 text-sidebar-foreground/70" strokeWidth={1.5} />
            <span className="hidden sm:inline font-heading text-base">
              YourAgencyToday Admin
            </span>
          </Link>

          <nav className="flex items-stretch gap-1 overflow-x-auto">
            {routes.map((route) => {
              const isActive = pathname === route.href
              const Icon = route.icon

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "border-brand-accent text-sidebar-foreground"
                      : "border-transparent text-sidebar-foreground/60 hover:border-sidebar-foreground/30 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{route.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center">
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  )
}
