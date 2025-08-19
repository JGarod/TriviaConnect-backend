const Joi = require("joi");

const esquemaSlug = Joi.object({
    slug: Joi.string().max(60).required(),
});

const esquemaProfileBasic = Joi.object({
       nombre_usuario: Joi.string().max(50).required(),
       email: Joi.string().email().max(100).required(),
});


const esquemaPasswords = Joi.object({
    password: Joi.string().max(50).required(),
    passwordUno: Joi.string().max(50).required(),
    passwordDos: Joi.string().max(50).required()
});

const esquemaPreferences = Joi.object({
    acepta_solicitud_amistad: Joi.boolean().required(),
    color_primario: Joi.string().max(7).required(),
    color_secundario: Joi.string().max(7).required()
});

module.exports = {
    esquemaSlug,
    esquemaProfileBasic,
    esquemaPasswords,
    esquemaPreferences
}