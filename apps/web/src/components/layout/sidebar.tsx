"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { LayoutDashboard, Plane, Map } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Session } from 'next-auth'

const routes = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Solicitudes de Viaje",
    href: "/solicitudes",
    icon: Plane,
  },
  {
    name: "Itinerarios",
    href: "/itinerarios",
    icon: Map,
  },
]

interface SidebarProps {
  session?: Session | null
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!session?.user || session.user.role !== 'ADMIN') {
      router.push('/unauthorized')
    }
  }, [session, router])

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <aside className="dark flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="h-1 airmail-stripe" />
      <div className="flex h-[calc(4rem-4px)] items-center gap-2 border-b border-sidebar-border px-6">
        <Plane className="h-6 w-6 text-sidebar-foreground/70" strokeWidth={1.5} />
        <span className="font-heading text-lg">YourAgencyToday Admin</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => {
          const isActive = pathname === route.href
          const Icon = route.icon

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-brand-accent"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{route.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
