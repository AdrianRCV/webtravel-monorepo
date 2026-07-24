import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/sign-in-button';
import { RegisterForm } from '@/components/auth/register-form';
import { Plane } from 'lucide-react';
import { LegalLinks } from '@/components/layout/legal-links';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const tab = params.tab || 'register';

  if (session?.user) {
    redirect('/client/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent shadow-lg">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
            YourAgencyToday
          </h1>
          <p className="mt-4 text-base text-zinc-600">
            Planifica tu próximo viaje de manera inteligente
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <a
            href="/register?tab=register"
            className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
              tab === 'register'
                ? 'border-b-2 border-brand text-brand'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registrarse
          </a>
          <a
            href="/login"
            className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
              tab === 'login'
                ? 'border-b-2 border-brand text-brand'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Inicia Sesión
          </a>
        </div>

        <div className="space-y-6 pt-4">
          {tab === 'register' ? (
            <>
              <RegisterForm />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-zinc-400">
                    O regístrate con
                  </span>
                </div>
              </div>

              <SignInButton />
            </>
          ) : (
            <>
              <div className="rounded-lg bg-gradient-to-br from-teal-50 to-indigo-50 p-6 text-center">
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Inicia sesión con Google para continuar
                </p>
              </div>
              <SignInButton />
            </>
          )}
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-zinc-400">
            ¿Eres administrador? {' '}
            <a
              href="/admin/login"
              className="font-medium text-brand hover:text-brand-accent transition-colors"
            >
              Accede aquí
            </a>
          </p>
        </div>

        <LegalLinks className="text-zinc-400 mt-4" />
      </div>
    </div>
  );
}
