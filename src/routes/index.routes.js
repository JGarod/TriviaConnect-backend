const { Router } = require("express");
const authRoutes = require("./auth/auth.routes");
const profileRoutes = require("./profile/user.routes");
const amistadRoutes = require("./users/amistad/users.routes");
const socialRoutes = require("./social/social.routes");
const historialRoutes = require("./historial/historial.routes");

const router = Router();

// Aquí centralizamos las rutas
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/amistad", amistadRoutes);
router.use("/social", socialRoutes);
router.use("/historial", historialRoutes);

module.exports = router;
