const rateLimit = require('express-rate-limit');

function crearLimiter({ windowMs, max, mensaje }) {
    return rateLimit({
        windowMs,
        max,
        handler: (req, res) => {
            res.status(429).json({
                error: 'Too many requests',
                message: mensaje || 'Has excedido el límite de solicitudes. Intenta más tarde.'
            });
        }
    });
}

module.exports = { crearLimiter };
