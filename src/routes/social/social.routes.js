const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth/jwt/jwt.middleware");
const { getDatabyID, buscarUsuarioString } = require("../../controllers/social/social.controller");

const   router = Router();
// const limiter5Min = crearLimiter({
//     windowMs: 5 * 60 * 1000, // 5 minutos
//     max: 5,
//     mensaje: 'Solo puedes solicitar un reenvío de correo cada 5 minutos'
// });
//obtener toda la info del usuario 
router.get("/getData", [verifyToken], getDatabyID);
//Buscar usuario
router.post('/buscarAmigo', [verifyToken], buscarUsuarioString);
module.exports = router;
