require('dotenv').config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Usuario } = require("../../../models/index.js");
const { Op } = require("sequelize");
const { enviarEmailVerificacion } = require("../../../utils/sendEmails.js");
const moment = require('moment');
const { throwCustomError } = require("../../../utils/throwCustomError.js");
const { emailRegistro } = require("../../../utils/mailsPlantilla.js");

//funcion para registar un usuario
const registerUser = async (req, res, next) => {
    try {
      let { nombre_usuario, email, password } = req.body;
      email = normalizarEmail(email);
        const existe = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { nombre_usuario }
                ]
            },
            attributes: ['email', 'nombre_usuario'] // Solo trae lo necesario
        });

        if (existe) {
            const mensaje = existe.email === email
              ? "El correo ya está en uso"
              : "El nombre de usuario ya está en uso";

            // return res.status(400).json({ message: mensaje });
          throwCustomError(mensaje, 400);
        }

        const password_hash = await bcrypt.hash(password, 10);
        const token_verificacion = crypto.randomBytes(32).toString("hex");
    
      let horamas24 = moment().add(24, 'hours').toDate(); // Hora actual del servidor + 24 horas

        await Usuario.create({
            nombre_usuario,
            email,
            password_hash,
            verificado: false,
            token_verificacion,
          token_verificacion_expira: horamas24
        });

        const enlace = `${process.env.APP_URL}/verificar?token=${token_verificacion}`;
      let html = emailRegistro(nombre_usuario, enlace)

        await enviarEmailVerificacion(email, enlace, `${process.env.APP_NAME} Haz clic para verificar tu cuenta`, html);

        res.json({ message: "Registro exitoso. Revisa tu email para verificar la cuenta." });

    } catch (error) {
        next(error);
    }
};

const normalizarEmail = (email) => {
  email = email.trim().toLowerCase();

  const [local, domain] = email.split('@');

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const sinPuntos = local.replace(/\./g, '');
    const sinAlias = sinPuntos.split('+')[0];
    return `${sinAlias}@gmail.com`;
  }

  return `${local}@${domain}`;
};

module.exports = { 
    registerUser
}
