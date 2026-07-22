"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Plane, Map, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    name: "Dashboard",
    href: "/",
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
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col bg-zinc-950 text-zinc-100">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
        <Plane className="h-6 w-6 text-zinc-400" />
        <span className="text-lg font-semibold">WebTravel Admin</span>
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-800 text-zinc-100 border-l-4 border-zinc-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
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
