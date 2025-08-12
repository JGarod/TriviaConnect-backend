require('dotenv').config();
const { Usuario } = require("../../../models");
const moment = require('moment-timezone');
const { enviarEmailVerificacion } = require("../../../utils/sendEmails");
const { emailRegistro } = require("../../../utils/mailsPlantilla");
const crypto = require("crypto");

//validar el token que se recibe despues de abrirlo desde el correo
const validateTokenRegister = async (req, res, next) => {
    try {
        const { token } = req.body;
        const usuario = await Usuario.findOne({
            where: { token_verificacion: token },
            attributes: ['id_usuario', 'nombre_usuario', 'token_verificacion_expira', 'email']
        });
        // tipos 1:valido,2:expirado,3:no valido
        if (!usuario) {
            return res.status(200).json({ message: 'Token inválido', tipo: 3 });
        } else {
            const fechaExpira = usuario.token_verificacion_expira;
            const ahoraUTC = moment.utc();
            console.log('ahoraUTC', ahoraUTC);
            console.log('fechaExpira', fechaExpira);
            // < si la fecha no existe o si existe pero es menor a la fecha actual se muere el token 
            if (!fechaExpira || fechaExpira < ahoraUTC) {
                return res.status(200).json({ message: "Token expirado", tipo: 2, email: usuario.email });
            } else {
                usuario.verificado = 1;
                usuario.token_verificacion = null;
                usuario.token_verificacion_expira = null;
                await usuario.save();

                return res.status(200).json({ message: 'Cuenta verificada', tipo: 1 });
            }
        }


    } catch (error) {
        next(error);
    }
};


//reenviar el correo a la hora de registrarse
const reenviarCorreo = async (req, res, next) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({
            where: {
                email
            },
            attributes: ['token_verificacion_expira', 'token_verificacion', 'verificado', 'nombre_usuario'] // Solo trae lo necesario
        });
        // tipos 1:valido,2:expirado,3:no valido
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no existe' });
        } else {
            const fechaExpira = usuario.token_verificacion_expira;
            const ahoraUTC = moment.utc();
            console.log('ahoraUTC', ahoraUTC);
            console.log('fechaExpira', fechaExpira);
            // si la fecha no existe o si existe pero es menor a la fecha actual se muere el token 
            if (usuario.verificado == 1) {
                return res.status(400).json({ message: "El usuario ya fue verificado" });
            } else if (!fechaExpira || fechaExpira < ahoraUTC) {
                //luego crear nuevo token y enviar
                return res.status(400).json({ message: "Token expirado" });
            } else {
                const enlace = `${process.env.APP_URL}/verificar?token=${usuario.token_verificacion}`;

                let html = emailRegistro(usuario.nombre_usuario, enlace);
                await enviarEmailVerificacion(email, enlace, `${process.env.APP_NAME} Haz clic para verificar tu cuenta`, html);

                return res.json({ message: "Correo enviado. Revisa tu bandeja de entrada para verificar tu cuenta." });
            }
        }


    } catch (error) {
        next(error);
    }
};

//reenviar nuevo token al correo
const newTokenReenviar = async (req, res, next) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({
            where: {
                email
            },
            attributes: ['id_usuario', 'nombre_usuario', 'verificado', 'token_verificacion', 'token_verificacion_expira'] // Solo trae lo necesario
        });
        // tipos 1:valido,2:expirado,3:no valido
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no existe' });
        } else {
            if (usuario.verificado == 1) {
                return res.status(400).json({ message: 'Usuario ya esta verificado' });
            }
            const token_verificacion = crypto.randomBytes(32).toString("hex");
            let horamas24 = moment().add(24, 'hours').toDate();

            usuario.token_verificacion = token_verificacion;
            usuario.token_verificacion_expira = horamas24;
            await usuario.save();
            const enlace = `${process.env.APP_URL}/verificar?token=${token_verificacion}`;
            let html = emailRegistro(usuario.nombre_usuario, enlace)

            await enviarEmailVerificacion(email, enlace, `${process.env.APP_NAME} Haz clic para verificar tu cuenta`, html);

            res.json({ message: "Revisa tu email para verificar la cuenta." });
        }


    } catch (error) {
        next(error);
    }
};


module.exports = {
    validateTokenRegister,
    reenviarCorreo,
    newTokenReenviar
}