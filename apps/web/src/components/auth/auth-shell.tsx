import type { ComponentType, ReactNode } from 'react';
import { Plane } from 'lucide-react';

interface AuthShellProps {
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthShell({ icon: Icon = Plane, title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md border border-border bg-card p-10 shadow-[0_24px_48px_-18px_oklch(0.22_0.02_55_/_0.4)]">
        <div className="h-1 -mx-10 -mt-10 mb-8 airmail-stripe" />

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-dashed border-stamp-foreground/50 bg-stamp text-stamp-foreground">
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 font-heading text-3xl tracking-tight text-balance">{title}</h1>
          {subtitle && <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card px-3 text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
