'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Plane } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

type ConfirmationState = 'loading' | 'success' | 'error';

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailChangeContent />
    </Suspense>
  );
}

function ConfirmEmailChangeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<ConfirmationState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setState('error');
      setErrorMessage('Falta el token de confirmación en el enlace.');
      return;
    }

    const confirm = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/account/email/confirm`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.message || 'El enlace de confirmación no es válido o ha caducado'
          );
        }

        setState('success');
      } catch (err) {
        setState('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Error al confirmar el nuevo email'
        );
      }
    };

    confirm();
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
            <p className="text-zinc-600">Confirmando tu nuevo email...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-bold text-zinc-900">¡Email actualizado!</h1>
            <p className="text-zinc-600">
              Tu email quedó actualizado. Iniciá sesión de nuevo con tu nuevo email.
            </p>
            <a
              href="/login"
              className="inline-block w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-white font-medium transition-all hover:shadow-lg"
            >
              Ir a iniciar sesión
            </a>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="text-2xl font-bold text-zinc-900">No se pudo confirmar</h1>
            <p className="text-zinc-600">{errorMessage}</p>
            <a
              href="/client/settings"
              className="inline-block w-full rounded-lg border border-zinc-300 px-4 py-3 text-zinc-700 font-medium transition-colors hover:bg-zinc-50"
            >
              Volver a ajustes de cuenta
            </a>
          </>
        )}
      </div>
    </div>
  );
}
