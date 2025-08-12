function emailRegistro(username,enlace) {
    try {
        let html = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Validar cuenta</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 20px; text-align: center; background-color: #004aad;">
                <img src="cid:logo_correo" alt="Logo" style="max-width: 120px; border-radius: 8px;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #333;">Confirma tu cuenta</h2>
                <p style="color: #555; font-size: 16px;">Hola ${username}, gracias por registrarte. Para completar tu registro y comenzar a usar nuestra plataforma, por favor valida tu cuenta haciendo clic en el botón de abajo.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${enlace}" target="_blank" style="background-color: #004aad; color: #ffffff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block;">
                    Validar cuenta
                  </a>
                </div>
                <p style="color: #888; font-size: 14px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <p style="color: #004aad; word-break: break-all;">${enlace}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; text-align: center; background-color: #f0f0f0; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} Tu App. Todos los derechos reservados.
              </td>
            </tr>
          </table>
        </body>
        </html>`;
return html;
    } catch (error) {
        console.error("Error enviando correo:", error);
        throw error;
    }
}

module.exports = {
  emailRegistro
}