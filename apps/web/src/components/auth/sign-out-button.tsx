'use client';

import { signOut } from 'next-auth/react';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { clearChatStorage } from '@/lib/chat-storage';

interface SignOutButtonProps {
  variant?: 'dropdown' | 'full';
}

export function SignOutButton({ variant = 'dropdown' }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      clearChatStorage();
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-600 dark:hover:bg-red-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cerrando sesión...</span>
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cerrando sesión...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </>
      )}
    </button>
  );
}
