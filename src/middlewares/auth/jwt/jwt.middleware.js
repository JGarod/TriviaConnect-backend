// authMiddleware.js
const jwt = require('jsonwebtoken');
const { throwCustomError } = require('../../../utils/throwCustomError');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // formato: "Bearer <token>"

    if (!token) throwCustomError('Token requerido', 401);
    // if (!token) return res.status(401).json({ message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // lo puedes usar luego
        next();
    } catch (err) {
        throwCustomError('Token inválido o expirado', 401);
        // return res.status(403).json({ message: 'Token inválido o expirado' });
        
    }
};

module.exports = verifyToken;
