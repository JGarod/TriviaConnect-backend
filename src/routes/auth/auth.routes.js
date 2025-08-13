const { Router } = require("express");
const { validateLogin } = require("../../middlewares/auth/auth.middleware");
const { validarRegistro, validarTokenRegisto, validarcorreoRegistro } = require("../../middlewares/auth/register/register.middleware");
const { registerUser } = require("../../controllers/auth/register/register.controller");
const { validateTokenRegister, reenviarCorreo, newTokenReenviar } = require("../../controllers/auth/token-validador/register-token.controller");
const { crearLimiter } = require("../../utils/limiteEnvios");
const { loginUser } = require("../../controllers/auth/login/login.controller");

const router = Router();
const limiter5Min = crearLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5,
    mensaje: 'Solo puedes solicitar un reenvío de correo cada 5 minutos'
});

// POST /api/auth/login
router.post("/login", [validateLogin], loginUser);


// POST /api/auth/register
//REGISTRARSE
router.post("/register", [validarRegistro], registerUser);
// RUTA PARA ENVIAR EL CORREO ELECTRONICO NUEVAMENTE
router.post("/reenviarCorreoRegistro", [limiter5Min, validarcorreoRegistro], reenviarCorreo);
// RUTA PARA VALIDAR EL TOKEN QUE SE ENVIO
router.post("/verificarRegistro", [limiter5Min,validarTokenRegisto], validateTokenRegister);
// RUTA PARA CAMBIAR TOKEN Y ENVIARLO NUEVAMENTE
router.post("/reenviarToken", [limiter5Min, validarcorreoRegistro], newTokenReenviar);

module.exports = router;
