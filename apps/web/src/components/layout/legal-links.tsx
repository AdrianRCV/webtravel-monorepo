import Link from 'next/link';
import { Link as LocaleLink } from '@/i18n/navigation';

export function LegalLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-xs ${className}`}>
      <Link href="/terminos" className="hover:underline">
        Términos
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/privacidad" className="hover:underline">
        Privacidad
      </Link>
      <span aria-hidden="true">·</span>
      <LocaleLink href="/contacto" className="hover:underline">
        Contacto
      </LocaleLink>
    </div>
  );
}
