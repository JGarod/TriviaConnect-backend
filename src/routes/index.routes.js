const { Router } = require("express");
const authRoutes = require("./auth/auth.routes");
const userRoutes = require("./user/user.routes");

const router = Router();

// Aquí centralizamos las rutas
router.use("/auth", authRoutes);
router.use("/profile", userRoutes);

module.exports = router;
