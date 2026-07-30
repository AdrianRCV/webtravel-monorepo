'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Client.DeleteAccountSection');
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
        throw new Error(data?.message || t('errorFallback'));
      }

      clearChatStorage();
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('errorGeneric'));
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-destructive/30 bg-destructive/5 p-6">
      <h3 className="text-sm font-semibold text-destructive">{t('dangerZoneTitle')}</h3>
      <p className="mt-2 text-sm text-destructive/90">
        {t('warning')}
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-4 border border-destructive/40 bg-card px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
      >
        {t('deleteButton')}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('dialogDescription')}
            </DialogDescription>
          </DialogHeader>

          <input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={t('confirmPlaceholder')}
            className="w-full border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:border-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
          />

          <DialogFooter>
            <button
              onClick={() => setOpen(false)}
              className="border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading || !confirmation}
              className="bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                  {t('deleting')}
                </>
              ) : (
                t('confirmDelete')
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
