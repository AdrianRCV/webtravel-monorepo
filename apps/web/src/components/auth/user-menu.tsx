'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SignOutButton } from './sign-out-button';
import { ChevronDown, User } from 'lucide-react';
import type { Session } from 'next-auth';

interface UserMenuProps {
  session: Session;
}

export function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || 'User'} />
          <AvatarFallback className="bg-zinc-200 text-xs font-medium dark:bg-zinc-700">
            {getInitials(session.user?.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {session.user?.name || 'Usuario'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {session.user?.email}
          </p>
        </div>
        
        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {session.user?.name || 'Usuario'}
            </p>
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {session.user?.email}
            </p>
            {session.user?.isAdmin && (
              <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Administrador
              </span>
            )}
          </div>
          
          <div className="p-1">
            <SignOutButton variant="dropdown" />
          </div>
        </div>
      )}
    </div>
  );
}
