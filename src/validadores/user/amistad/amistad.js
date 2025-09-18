const Joi = require("joi");

const esquemaGestionarAmistad = Joi.object({
    id_usuario: Joi.number().min(1),
    estado: Joi.string().max(15).required()
});


module.exports = {
    esquemaGestionarAmistad
}