const { esquemaRegistro, esquemaTokenRegistro } = require("../../../validadores/auth/register/register");

const validarRegistro = (req, res, next) => {
    const { error } = esquemaRegistro.validate(req.body, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    }else{
        if (req.body.passwordUno !== req.body.passwordDos) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }
        req.body.password = req.body.passwordUno;
        next();
    }

  
};

const validarTokenRegisto = (req, res, next) => {
    const { error } = esquemaTokenRegistro.validate(req.body, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    }
    next();
};


module.exports = {
    validarRegistro,
    validarTokenRegisto
}
