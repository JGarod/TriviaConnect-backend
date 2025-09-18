const { Router } = require("express");
const { verifyToken } = require("../../middlewares/auth/jwt/jwt.middleware");
const { getHistory } = require("../../controllers/historial/historial.controller");

const router = Router();

//buscar el historial de un usuario y sus amigos
router.get("/", [verifyToken], getHistory);


module.exports = router;
