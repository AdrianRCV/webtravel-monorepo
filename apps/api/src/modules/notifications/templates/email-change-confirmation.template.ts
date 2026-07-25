import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';

export interface EmailChangeConfirmationData extends BaseEmailData {
  confirmUrl: string;
}

export const emailChangeConfirmationTemplate = (
  data: EmailChangeConfirmationData,
): string => {
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        Confirmá tu nuevo email
      </h1>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      Recibimos una solicitud para cambiar el email de tu cuenta en YourAgencyToday a esta
      dirección. Si fuiste vos, hacé clic en el siguiente botón para confirmar el cambio.
    </p>

    <div style="text-align: center; margin-top: 35px;">
      <a href="${escapeHtml(data.confirmUrl)}" class="button">
        Confirmar nuevo email
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Este enlace caduca en 1 hora. Si no solicitaste este cambio, podés ignorar este mensaje: tu email actual seguirá siendo el mismo.
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: 'Confirmá tu nuevo email de YourAgencyToday',
  });
};
