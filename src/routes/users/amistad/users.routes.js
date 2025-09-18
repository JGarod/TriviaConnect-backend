const { Router } = require("express");

const { gestionarAmistad } = require("../../../controllers/user/amistad/amistad.controller");
const { verifyToken } = require("../../../middlewares/auth/jwt/jwt.middleware");
const { validarAmistad, ValidarSchemaAmistad } = require("../../../middlewares/user/amistad/amistad.middleware");

const   router = Router();

//gestionar una amistad
router.post("/gestionar", [verifyToken, ValidarSchemaAmistad,validarAmistad], gestionarAmistad);


module.exports = router;
