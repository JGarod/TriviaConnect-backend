const { Router } = require("express");
const { login } = require("../../controllers/auth/auth.controller");
const { validateLogin } = require("../../middlewares/auth/auth.middleware");
const { validarRegistro, validarTokenRegisto } = require("../../middlewares/auth/register/register.middleware");
const { registerUser } = require("../../controllers/auth/register/register.controller");
const { validateTokenRegister } = require("../../controllers/auth/token-validador/register-token.controller");
const { crearLimiter } = require("../../utils/limiteEnvios");

const router = Router();
const limiter5Min = crearLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 3,
    mensaje: 'Solo puedes solicitar un reenvío de correo cada 5 minutos'
});

// POST /api/auth/login
// router.post("/login", [validateLogin], login);


// POST /api/auth/register
router.post("/register", [validarRegistro], registerUser);

router.post("/verificarRegistro", [limiter5Min,validarTokenRegisto], validateTokenRegister);


module.exports = router;
