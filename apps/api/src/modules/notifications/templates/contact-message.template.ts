import { baseTemplate, BaseEmailData } from './base.template';
import { escapeHtml } from './escape';

export interface ContactMessageEmailData extends BaseEmailData {
  senderName: string;
  senderEmail: string;
  message: string;
}

export const contactMessageTemplate = (data: ContactMessageEmailData): string => {
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        Nuevo mensaje de contacto
      </h1>
    </div>

    <p style="font-size: 16px; color: #333;">
      <strong>Nombre:</strong> ${escapeHtml(data.senderName)}<br/>
      <strong>Email:</strong> ${escapeHtml(data.senderEmail)}
    </p>

    <p style="font-size: 16px; color: #333; line-height: 1.8; white-space: pre-wrap; border-left: 3px solid #667eea; padding-left: 16px; margin-top: 20px;">
      ${escapeHtml(data.message)}
    </p>
  `;

  return baseTemplate(content, {
    previewText: `Nuevo mensaje de contacto de ${data.senderName}`,
  });
};
