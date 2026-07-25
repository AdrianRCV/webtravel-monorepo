import Link from 'next/link';
import { Plane } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent shadow-lg">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
            Recuperar contraseña
          </h1>
          <p className="mt-4 text-base text-zinc-600">
            Te enviamos un enlace para elegir una nueva contraseña.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-zinc-600">
          <Link
            href="/login"
            className="font-medium text-brand hover:text-brand-accent transition-colors"
          >
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
