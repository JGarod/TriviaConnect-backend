const { Op } = require("sequelize");
const { normalizarEmail } = require("../../../controllers/auth/register/register.controller");
const { Usuario } = require("../../../models");
const { esquemaSlug, esquemaProfileBasic, esquemaPasswords, esquemaPreferences } = require("../../../validadores/user/profile/profile");
const { throwCustomError } = require("../../../utils/throwCustomError");
const { slugify, validarSlugUser } = require("../../../helper/slugConverter");
const bcrypt = require("bcrypt");
const { limpiarYValidarHex } = require("../../../helper/hexadecimalValidador");

//valida que llegue slug
const validarSlug = (req, res, next) => {
    const { error } = esquemaSlug.validate(req.params, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    }else{
        next();
    }

  
};

//valida que venga username y email
const validarDatosBasicos = (req, res, next) => {
    const { error } = esquemaProfileBasic.validate(req.body, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    } else {
        next();
    }


};

//busca el usuario por emial para ver si se puede seguir
const findUserByUsername = async (req, res, next) => {
    try {
        let { nombre_usuario, email } = req.body;
        let { id,slug } = req.user;
        email = normalizarEmail(email);
        req.body.email = email;
        const existe = await Usuario.findOne({
            where: {
                [Op.or]: [
                    { email },
                    // { nombre_usuario }
                ],
                id_usuario: { [Op.ne]: id } 
            },
            attributes: ['email', 'nombre_usuario'] // Solo trae lo necesario
        });

        if (existe) {
            const mensaje = existe.email === email
                ? "El correo ya está en uso"
                : "El nombre de usuario ya está en uso";

            // return res.status(400).json({ message: mensaje });
            throwCustomError(mensaje, 400);
        } else {
            let baseSlug = slugify(nombre_usuario);
            if (slug !== baseSlug) {
                 slug = await validarSlugUser(baseSlug);
            }

            req.body.slug = slug;
            console.log(slug);
            next();
        }

    } catch (error) {
        console.log('error',error);
        throwCustomError(error,400)
    }
};

const validarPasswords = (req, res, next) => {
    const { error } = esquemaPasswords.validate(req.body, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    } else {
        let { password, passwordUno, passwordDos } = req.body
        if (passwordUno === passwordDos) {
            if (password === passwordUno) {
                throwCustomError('La nueva contraseña no puede ser igual a la anterior', 400);
            }
            next();
        } else {
            throwCustomError('Las contraseñas son diferentes', 400);
        }
    }
};


const comparePasswords = async (req, res, next) => {
    try {
        let { password }=req.body;
        let {id}=req.user;
        console.log('id',id);
        const existe = await Usuario.findOne({
            where: {
                id_usuario:id 
            },
            attributes: ['password_hash'] // Solo trae lo necesario
        });
        if (existe) {
            const validPassword = await bcrypt.compare(password, existe.password_hash);
            if (!validPassword) {
                throwCustomError('La contraseña actual es incorrecta', 400);
            }
            next();
        } else {
            throwCustomError('Usuario inexistente', 400)
        }

    } catch (error) {
        console.log('error', error);
        throwCustomError(error, 400)
    }
};


//valida que llegue objeto de preferencias
const validarPreferencesUser = (req, res, next) => {
    const { error } = esquemaPreferences.validate(req.body, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    } else {
        let { color_secundario, color_primario } = req.body;
        req.body.color_secundario = limpiarYValidarHex(color_secundario);
        req.body.color_primario = limpiarYValidarHex(color_primario);

        next();
    }


};

module.exports = {
    validarSlug,
    validarDatosBasicos,
    findUserByUsername,
    validarPasswords,
    comparePasswords,
    validarPreferencesUser
}
