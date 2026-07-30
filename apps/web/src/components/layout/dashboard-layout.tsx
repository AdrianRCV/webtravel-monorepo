'use client'

import { AdminNav } from "./admin-nav"
import type { Session } from 'next-auth'

interface DashboardLayoutProps {
  children: React.ReactNode
  session?: Session | null
}

export function DashboardLayout({ children, session }: DashboardLayoutProps) {
  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav session={session} />

      <main className="flex-1 bg-muted/40">
        {children}
      </main>
    </div>
  )
}
