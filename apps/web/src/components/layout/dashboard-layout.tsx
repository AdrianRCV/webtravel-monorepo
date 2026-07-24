'use client'

import { Header } from "./header"
import { Sidebar } from "./sidebar"
import type { Session } from 'next-auth'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  session?: Session | null
}

export function DashboardLayout({ children, title = "Dashboard", session }: DashboardLayoutProps) {
  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar session={session} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} session={session} />
        
        <main className="flex-1 overflow-y-auto bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  )
}
