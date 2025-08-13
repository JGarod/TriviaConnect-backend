// src/middlewares/validate.middleware.js
const validateLogin = (req, res, next) => {
    const { nombre_usuario, password, ...rest } = req.body;

    // Validar campos obligatorios
    if (!nombre_usuario || !password) {
        return res.status(400).json({ message: "nombre_usuario y contraseña son requeridos" });
    }

    // Validar que no se envíen más campos
    if (Object.keys(rest).length > 0) {
        return res.status(400).json({ message: "Parámetros no permitidos en la solicitud" });
    }

    next();
};

module.exports = { validateLogin };
