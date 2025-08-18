const { Router } = require("express");

const { verifyToken } = require("../../middlewares/auth/jwt/jwt.middleware");
const { validarSlug, validarDatosBasicos, findUserByUsername, validarPasswords, comparePasswords } = require("../../middlewares/user/profile/profile.middleware");
const { findUserBySlug, findUserByIDEdit, updateDataBasica, updatePasswordUser } = require("../../controllers/user/profile/profile.controller");
const upload = require("../../middlewares/cloudinary/cloudinary.middleware");
const { uploadUserCloudinary } = require("../../controllers/cloudinary/uploadCloudinay.controller");

const   router = Router();
// const limiter5Min = crearLimiter({
//     windowMs: 5 * 60 * 1000, // 5 minutos
//     max: 5,
//     mensaje: 'Solo puedes solicitar un reenvío de correo cada 5 minutos'
// });
//traer la informaicon publica de un usuario por slug
router.get("/view/:slug", [verifyToken, validarSlug], findUserBySlug);
//traer la informaicon privada de un usuario por id
router.get("/viewPrivate", [verifyToken], findUserByIDEdit);
//subir la foto de perfil 
router.post('/edit/upload-profile', [verifyToken,upload.single('avatar')], uploadUserCloudinary);
//actualizar data basica usuario
router.post('/edit/datos-basicos', [verifyToken, validarDatosBasicos, findUserByUsername], updateDataBasica);
//actualizar contraseña Usuario
router.post('/edit/password-user', [verifyToken, validarPasswords, comparePasswords], updatePasswordUser);


module.exports = router;
