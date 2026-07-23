import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { CredentialsForm } from '@/components/auth/credentials-form';
import { Lock } from 'lucide-react';

const VALID_REDIRECT_PATHS = [
  '/dashboard',
  '/solicitudes',
  '/itinerarios',
  '/chat',
  '/admin/login',
];

function isValidRedirectPath(path: string): boolean {
  return VALID_REDIRECT_PATHS.some(validPath =>
    path === validPath || path.startsWith(validPath + '/')
  );
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  
  if (session?.user) {
    if (session.user.role === 'ADMIN') {
      const redirectTo = params.callbackUrl && isValidRedirectPath(params.callbackUrl)
        ? params.callbackUrl
        : '/dashboard';
      redirect(redirectTo);
    } else {
      redirect('/chat');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-100">
            Acceso Administrativo
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Panel exclusivo para administradores del sistema
          </p>
        </div>

        <CredentialsForm />

        <div className="text-center">
          <p className="text-xs text-zinc-500">
            ¿Eres un cliente? {' '}
            <a 
              href="/login" 
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
