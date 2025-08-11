// src/utils/throwCustomError.js
function throwCustomError(message, statusCode = 400) {
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err; // Esto será capturado por el errorHandler
}

module.exports = {
    throwCustomError
}