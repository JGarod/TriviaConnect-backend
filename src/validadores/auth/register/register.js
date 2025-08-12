const Joi = require("joi");

// const esquemaRegistro = Joi.object({
//     nombre_usuario: Joi.string().max(30).required(),
//     email: Joi.string().email().max(100).required(),
//     passwordUno: Joi.string().max(50).required(),
//     passworDos: Joi.string().max(50).required(),
//     // productos: Joi.array()
//     //     .items(
//     //         Joi.object({
//     //             id: Joi.number().integer().min(1).required(),
//     //             nombre: Joi.string().max(100).required(),
//     //             cantidad: Joi.number().integer().min(1).required(),
//     //             precio: Joi.number().min(0).optional()
//     //         })
//     //     )
//     //     .required()
// });

const esquemaRegistro = Joi.object({
    nombre_usuario: Joi.string().max(30).required(),
    email: Joi.string().email().max(100).required(),
    passwordUno: Joi.string().max(50).required(),
    passwordDos: Joi.string().max(50).required()
});


const esquemaTokenRegistro = Joi.object({
    token: Joi.string().max(255).required(),
});
const esquemaRegistroCorreo = Joi.object({
    email: Joi.string().max(255).required(),
});

module.exports = {
    esquemaRegistro,
    esquemaTokenRegistro,
    esquemaRegistroCorreo
}