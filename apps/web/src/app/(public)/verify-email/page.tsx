'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Plane } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

type VerificationState = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMessage('Falta el token de verificación en el enlace.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.message || 'El enlace de verificación no es válido o ha caducado'
          );
        }

        setState('success');
      } catch (err) {
        setState('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Error al verificar el correo'
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-10 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
          <Plane className="h-8 w-8 text-white" />
        </div>

        {state === 'loading' && (
          <>
            <Spinner size="lg" className="mx-auto text-blue-600" />
            <p className="text-zinc-600">Verificando tu correo electrónico...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-bold text-zinc-900">¡Correo verificado!</h1>
            <p className="text-zinc-600">
              Tu cuenta ha quedado confirmada. Ya puedes acceder a tu panel con todo tu
              historial de solicitudes de viaje asociado a este correo.
            </p>
            <a
              href="/client/dashboard"
              className="inline-block w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-white font-medium transition-all hover:shadow-lg"
            >
              Ir a mi panel
            </a>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="text-2xl font-bold text-zinc-900">No se pudo verificar</h1>
            <p className="text-zinc-600">{errorMessage}</p>
            <a
              href="/login"
              className="inline-block w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-700 font-medium transition-colors hover:bg-zinc-50"
            >
              Volver a iniciar sesión
            </a>
          </>
        )}
      </div>
    </div>
  );
}
