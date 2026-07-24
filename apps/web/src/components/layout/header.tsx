"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { UserMenu } from "@/components/auth/user-menu"
import type { Session } from 'next-auth'

interface HeaderProps {
  title: string
  session?: Session | null
}

export function Header({ title, session }: HeaderProps) {
  const [open, setOpen] = useState(false)

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar session={session} />
          </SheetContent>
        </Sheet>
        
        <h1 className="text-xl font-semibold text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu session={session} />
      </div>
    </header>
  )
}
