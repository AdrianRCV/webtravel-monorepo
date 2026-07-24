import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Cómo YourAgencyToday recopila, usa y protege tus datos.',
};

export default function PrivacidadPage() {
  return (
    <LegalPageLayout title="Política de Privacidad">
      <p>
        Esta política explica qué datos recopilamos en YourAgencyToday, para qué los
        usamos y qué derechos tenés sobre ellos.
      </p>

      <h2>Qué datos recopilamos</h2>
      <ul>
        <li>
          Tu email y una contraseña almacenada de forma cifrada (o tu cuenta de Google,
          si elegís ese método de acceso).
        </li>
        <li>
          Los detalles de viaje que compartís en el chat: destino, origen, fechas,
          presupuesto y número de personas.
        </li>
        <li>
          El contenido de los mensajes que enviás a nuestro chat, que se procesan
          mediante un proveedor externo de inteligencia artificial para generar
          respuestas.
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Diseñar y proponerte un itinerario de viaje a medida.</li>
        <li>Enviarte por email actualizaciones sobre el estado de tu solicitud.</li>
        <li>Mantener tu historial de conversaciones asociado a tu cuenta.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Usamos una cookie de sesión estrictamente necesaria para mantener tu inicio de
        sesión activo. No usamos cookies de seguimiento publicitario.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Podés pedirnos acceder a tus datos o eliminarlos por completo escribiéndonos
        desde nuestro{' '}
        <a href="/contacto" className="text-brand underline">
          formulario de contacto
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
