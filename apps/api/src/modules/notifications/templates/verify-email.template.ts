import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';

export interface VerifyEmailData extends BaseEmailData {
  verificationUrl: string;
}

export const verifyEmailTemplate = (data: VerifyEmailData): string => {
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        Confirma tu correo electrónico
      </h1>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      Gracias por crear tu cuenta en YourAgencyToday. Para proteger tu cuenta y las solicitudes de viaje
      asociadas a tu correo, necesitamos que confirmes que este correo te pertenece.
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.verificationUrl)}" class="button">
        Verificar mi correo
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Este enlace caduca en 24 horas. Si tú no creaste esta cuenta, puedes ignorar este mensaje.
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: 'Confirma tu correo electrónico para activar tu cuenta',
  });
};
