import Link from 'next/link';
import { Plane } from 'lucide-react';

export function LegalPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-accent transition-colors"
        >
          <Plane className="h-4 w-4" />
          YourAgencyToday
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-zinc-900">{title}</h1>

        <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-700 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>

        <p className="mt-12 text-xs text-zinc-400">Última actualización: julio de 2026.</p>
      </div>
    </div>
  );
}
