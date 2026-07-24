import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/sign-in-button';
import { ClientLoginForm } from '@/components/auth/client-login-form';
import { Plane } from 'lucide-react';

const VALID_REDIRECT_PATHS = [
  '/dashboard',
  '/solicitudes',
  '/itinerarios',
  '/chat',
  '/admin/login',
  '/client/dashboard',
];

function isValidRedirectPath(path: string): boolean {
  return VALID_REDIRECT_PATHS.some(validPath =>
    path === validPath || path.startsWith(validPath + '/')
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl && isValidRedirectPath(params.callbackUrl)
    ? params.callbackUrl
    : '/client/dashboard';

  if (session?.user) {
    const redirectTo = params.callbackUrl && isValidRedirectPath(params.callbackUrl)
      ? params.callbackUrl
      : '/chat';
    redirect(redirectTo);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            WebTravel
          </h1>
          <p className="mt-4 text-base text-zinc-600">
            Planifica tu próximo viaje de manera inteligente
          </p>
        </div>

        <div className="space-y-6 pt-4">
          <SignInButton callbackUrl={callbackUrl} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-zinc-400">
                O inicia sesión con tu email
              </span>
            </div>
          </div>

          <ClientLoginForm callbackUrl={callbackUrl} />

          <p className="text-center text-sm text-zinc-600">
            ¿No tienes cuenta?{' '}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Regístrate aquí
            </a>
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-zinc-400">
            ¿Eres administrador? {' '}
            <a
              href="/admin/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Accede aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
