// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error("🔥 Error:", err.message);

    // Si el error tiene statusCode lo usamos, si no, ponemos 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "Error interno del servidor"
    });
}


module.exports =  {
    errorHandler 
}