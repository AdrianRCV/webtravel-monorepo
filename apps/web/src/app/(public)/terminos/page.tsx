import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export const metadata = {
  title: 'Términos y Condiciones | YourAgencyToday',
  description: 'Términos y condiciones de uso de YourAgencyToday.',
};

export default function TerminosPage() {
  return (
    <LegalPageLayout title="Términos y Condiciones">
      <p>
        Estos Términos y Condiciones regulan el uso del sitio web y el chat de
        planificación de viajes de YourAgencyToday (&quot;nosotros&quot;, &quot;la
        agencia&quot;). Al usar el sitio, aceptás estos términos.
      </p>

      <h2>Qué ofrecemos</h2>
      <p>
        A través de nuestro chat con inteligencia artificial recopilamos los datos de tu
        viaje (destino, fechas, presupuesto, origen y número de personas) para que uno de
        nuestros especialistas diseñe una propuesta de itinerario a medida. La propuesta
        final y su disponibilidad quedan sujetas a confirmación humana.
      </p>

      <h2>Tu cuenta</h2>
      <ul>
        <li>Sos responsable de mantener tu contraseña en privado.</li>
        <li>La información que nos brindes debe ser veraz.</li>
        <li>
          Podés solicitar la eliminación de tu cuenta y tus datos en cualquier momento a
          través de nuestro{' '}
          <a href="/contacto" className="text-brand underline">
            formulario de contacto
          </a>
          .
        </li>
      </ul>

      <h2>Limitación de responsabilidad</h2>
      <p>
        Los itinerarios propuestos dependen de la disponibilidad real de proveedores
        externos (aerolíneas, hoteles, transportes) al momento de la reserva. No
        garantizamos precios ni disponibilidad hasta que una reserva quede confirmada
        explícitamente por un especialista.
      </p>

      <h2>Cambios a estos términos</h2>
      <p>
        Podemos actualizar estos términos ocasionalmente. Los cambios importantes se
        reflejarán en esta misma página.
      </p>
    </LegalPageLayout>
  );
}
