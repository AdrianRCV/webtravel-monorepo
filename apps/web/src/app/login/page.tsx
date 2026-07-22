import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/sign-in-button';
import { CredentialsForm } from '@/components/auth/credentials-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  
  if (session?.user) {
    redirect(params.callbackUrl || '/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            WebTravel
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Inicia sesión para continuar
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Acceso Administrativo
          </h2>
          <CredentialsForm />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              o continúa con
            </span>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Acceso de Cliente
          </h2>
          <SignInButton />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Los administradores usan email y contraseña.
          <br />
          Los clientes usan su cuenta de Google.
        </p>
      </div>
    </div>
  );
}
