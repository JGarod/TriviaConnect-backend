require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true para 465, false para 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Función específica para email de verificación
async function enviarEmailVerificacion(email, enlace, titulo, html) {
    const subject = titulo;
    const text = `Haz clic para verificar tu cuenta: ${enlace}`;

    await enviarEmail({ to: email, subject, text, html });
}

// Puedes agregar más funciones para otros tipos de correo, ej:
// enviarEmailRecuperacionPassword, enviarEmailNotificacion, etc.
// Función genera para enviar email
async function enviarEmail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"Tu App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(__dirname, '../../public/logo.png'),
                    cid: 'logo_correo' // Debe coincidir con el cid en el HTML
                }
            ]
        });

        console.log("Correo enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error enviando correo:", error);
        throw error;
    }
}
module.exports = {
    enviarEmailVerificacion,
};
