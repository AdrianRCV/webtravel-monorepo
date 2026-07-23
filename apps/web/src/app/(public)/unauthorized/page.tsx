import { AlertCircle, MessageSquare, LogIn } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';

export default async function UnauthorizedPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-zinc-50 to-zinc-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Acceso Denegado
          </h1>
          
          {isAuthenticated ? (
            <>
              <p className="mt-3 text-sm text-zinc-600">
                Tu cuenta no tiene permisos para acceder al panel de administración.
              </p>
              
              <p className="mt-2 text-xs text-zinc-500">
                Si necesitas acceso administrativo, contacta al administrador del sistema.
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-zinc-600">
                Necesitas iniciar sesión con una cuenta autorizada para acceder a esta área.
              </p>
              
              <p className="mt-2 text-xs text-zinc-500">
                Solo los administradores pueden acceder al panel.
              </p>
            </>
          )}
        </div>

        <div className="space-y-3 pt-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/chat"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Ir al Chat de Viajes
              </Link>
              
              <SignOutButton variant="full" />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Link>
              
              <Link
                href="/chat"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <MessageSquare className="h-4 w-4" />
                Continuar sin Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
