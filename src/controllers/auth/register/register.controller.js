require('dotenv').config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Usuario, sequelize, Preferencias } = require("../../../models/index.js");
const { Op } = require("sequelize");
const { enviarEmailVerificacion } = require("../../../utils/sendEmails.js");
const moment = require('moment');
const { throwCustomError } = require("../../../utils/throwCustomError.js");
const { emailRegistro } = require("../../../utils/mailsPlantilla.js");
const { slugify, validarSlugUser } = require('../../../helper/slugConverter.js');
const { v4: uuidv4 } = require('uuid');
const { generarCodigoAmigo } = require('../../../helper/codeFriendConverter.js');

//funcion para registar un usuario
const registerUser = async (req, res, next) => {
  const transaction = await sequelize.transaction(); // Inicia la transacción

  try {
    let { nombre_usuario, email, password } = req.body;
    email = normalizarEmail(email); // Normaliza el email para evitar errores de mayúsculas/minúsculas

    // Verificar si el usuario o correo ya existen
    const existe = await Usuario.findOne({
      where: {
        [Op.or]: [
          { email },
          // { nombre_usuario }
        ]
      },
      attributes: ['email', 'nombre_usuario'],
      transaction // Asegura que la consulta esté bajo la transacción
    });

    if (existe) {
      const mensaje = existe.email === email
        ? "El correo ya está en uso"
        : "El nombre de usuario ya está en uso";
      throwCustomError(mensaje, 400); // Lanza un error con el mensaje adecuado
    }

    // Generar slug y código de amigo
    let baseSlug = slugify(nombre_usuario);
    let slug = await validarSlugUser(baseSlug);
    let codeFriend = await generarCodigoAmigo();

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);
    const token_verificacion = crypto.randomBytes(32).toString("hex");
    let horamas24 = moment().add(24, 'hours').toDate(); // Hora actual + 24 horas

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre_usuario,
      email,
      slug,
      codeFriend,
      uuid_imagen: uuidv4(),
      password_hash,
      verificado: false,
      token_verificacion,
      token_verificacion_expira: horamas24
    }, { transaction }); // Usamos la transacción

    // Crear las preferencias del usuario
    await Preferencias.create({
      id_usuario: usuario.id_usuario, // Asocia las preferencias al usuario creado
      acepta_solicitud_amistad: true, // Valor predeterminado
      color_primario: "1E3A8A", // Color primario predeterminado
      color_secundario: "9333EA" // Color secundario predeterminado
    }, { transaction });

    // Confirmar la transacción
    await transaction.commit();

    // Enviar correo de verificación
    const enlace = `${process.env.APP_URL}/verificar?token=${token_verificacion}`;
    let html = emailRegistro(nombre_usuario, enlace);
    await enviarEmailVerificacion(email, enlace, `${process.env.APP_NAME} Haz clic para verificar tu cuenta`, html);

    return res.status(200).json({ message: "Registro exitoso. Revisa tu email para verificar la cuenta." });

  } catch (error) {
    // Si algo falla, revertimos la transacción
    await transaction.rollback();
    next(error); // Lanza el error al middleware de manejo de errores
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
  registerUser, normalizarEmail
}
