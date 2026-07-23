import { escapeHtml } from './escape';

export interface BaseEmailData {
  recipientName?: string;
  previewText: string;
}

export const baseTemplate = (content: string, data: BaseEmailData): string => {
  const escapedRecipientName = data.recipientName
    ? escapeHtml(data.recipientName)
    : undefined;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>WebTravel</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #f5f5f5;
      padding: 20px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #2d3561 100%);
      padding: 30px 40px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px;
      color: #333333;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 30px 40px;
      text-align: center;
      color: #666666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content, .header, .footer {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">✈️ WebTravel</div>
      </div>
      <div class="content">
        ${escapedRecipientName ? `<p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hola ${escapedRecipientName},</p>` : ''}
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 10px 0;">WebTravel - Tu agencia de viajes de confianza</p>
        <p style="margin: 0; font-size: 13px; color: #999;">
          Este es un correo automático, por favor no responder directamente.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};
