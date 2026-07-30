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
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md border border-border bg-card p-10 shadow-[0_24px_48px_-18px_oklch(0_0_0/0.5)]">
        <div className="h-1 -mx-10 -mt-10 mb-8 airmail-stripe" />
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-dashed border-stamp-foreground/50 bg-stamp text-stamp-foreground">
            <Lock className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 font-heading text-3xl tracking-tight text-foreground">
            Acceso Administrativo
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Panel exclusivo para administradores del sistema
          </p>
        </div>

        <div className="mt-8">
          <CredentialsForm />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            ¿Eres un cliente?{' '}
            <a
              href="/login"
              className="font-medium text-brand hover:text-brand-accent transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
