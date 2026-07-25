'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { clearChatStorage } from '@/lib/chat-storage';

export function DeleteAccountSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ confirmation }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'No se pudo eliminar la cuenta');
      }

      clearChatStorage();
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la cuenta');
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h3 className="text-sm font-semibold text-red-900">Zona de peligro</h3>
      <p className="mt-2 text-sm text-red-700">
        Eliminar tu cuenta borra permanentemente tu historial de conversaciones y solicitudes de
        viaje. Esta acción no se puede deshacer.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
      >
        Eliminar mi cuenta
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar tu cuenta?</DialogTitle>
            <DialogDescription>
              Escribí tu contraseña actual (o &quot;ELIMINAR&quot; si tu cuenta usa Google) para
              confirmar. Esta acción es permanente.
            </DialogDescription>
          </DialogHeader>

          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Contraseña actual o ELIMINAR"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200"
          />

          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading || !confirmation}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                'Sí, eliminar mi cuenta'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
