import { AlertCircle, ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { SignOutButton } from '@/components/auth/sign-out-button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Acceso Denegado
          </h1>
          
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            No tienes permisos para acceder al panel de administración.
          </p>
          
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <SignOutButton variant="full" />
          
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Chat Público
          </Link>
        </div>
      </div>
    </div>
  );
}
