const { Router } = require("express");
const authRoutes = require("./auth/auth.routes");

const router = Router();

// Aquí centralizamos las rutas
router.use("/auth", authRoutes);

module.exports = router;
