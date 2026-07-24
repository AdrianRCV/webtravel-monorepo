import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';

export interface PasswordResetEmailData extends BaseEmailData {
  resetUrl: string;
}

export const passwordResetTemplate = (data: PasswordResetEmailData): string => {
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        Recupera tu contraseña
      </h1>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta en YourAgencyToday.
      Si fuiste tú, hacé clic en el siguiente botón para elegir una nueva contraseña.
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.resetUrl)}" class="button">
        Restablecer contraseña
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Este enlace caduca en 1 hora. Si no solicitaste este cambio, podés ignorar este mensaje: tu contraseña actual seguirá funcionando.
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: 'Restablecé tu contraseña de YourAgencyToday',
  });
};
