import { baseTemplate, BaseEmailData } from './base.template';

export type GoogleAccountNoticeData = BaseEmailData;

export const googleAccountNoticeTemplate = (data: GoogleAccountNoticeData): string => {
  const content = `
    <div style="text-align: center; margin: 30px 0;">
      <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 10px;">
        Esta cuenta usa Google
      </h1>
    </div>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      Recibimos una solicitud para restablecer la contraseña de esta cuenta, pero está
      registrada mediante &quot;Iniciar sesión con Google&quot; y no tiene una contraseña propia.
    </p>

    <p style="font-size: 16px; color: #333; line-height: 1.8;">
      Para acceder, usá el botón &quot;Continuar con Google&quot; en la página de inicio de sesión.
    </p>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Si no solicitaste esto, podés ignorar este mensaje.
    </p>
  `;

  return baseTemplate(content, {
    recipientName: data.recipientName,
    previewText: 'Esta cuenta usa Inicio de sesión con Google',
  });
};
