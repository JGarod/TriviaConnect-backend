// const { throwCustomError } = require("../../utils/throwCustomError");


// const register = (req, res, next) => {
//     try {
//         const { username, password } = req.body || {};

//         if (!username || !password) {
//             throwCustomError("Todos los campos son obligatorios", 400);
//         }

//         // Ejemplo: validación ficticia
//         if (username === "admin") {
//             throwCustomError("El usuario ya existe", 409);
//         }

//         // Simulamos un registro exitoso
//         res.status(201).json({
//             success: true,
//             message: "Usuario registrado correctamente"
//         });
//     } catch (err) {
//         next(err); // Mandamos el error al errorHandler
//     }
// };

// const login = (req, res, next) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             throwCustomError("Usuario y contraseña requeridos", 400);
//         }

//         // Ejemplo de validación ficticia
//         if (username !== "test" || password !== "1234") {
//             throwCustomError("Credenciales inválidas", 401);
//         }

//         res.status(200).json({
//             success: true,
//             message: "Inicio de sesión exitoso"
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// module.exports = { login, register };
