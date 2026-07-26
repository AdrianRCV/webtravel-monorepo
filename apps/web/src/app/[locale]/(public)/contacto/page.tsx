import { Plane } from 'lucide-react';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata = {
  title: 'Contacto',
  description: 'Escribinos y un especialista de YourAgencyToday te responderá a la brevedad.',
};

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-accent shadow-lg">
            <Plane className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-brand to-brand-accent bg-clip-text text-transparent">
            ¿Necesitas ayuda?
          </h1>
          <p className="mt-4 text-base text-zinc-600">
            Escribinos y un especialista te responderá a la brevedad.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
