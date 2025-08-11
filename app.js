require('dotenv').config();
const express = require('express');
const db = require('./src/models');
const morgan = require('morgan');
const routes = require("./src/routes/index.routes");
const { errorHandler } = require('./src/utils/errorHandler');
const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de prueba
app.use(morgan("dev"));

// Rutas
app.use("/api", routes);
//errores manejados
app.use(errorHandler);
// Sincronizar DB y levantar servidor
db.sequelize.sync() // crea/actualiza tablas
// db.sequelize.sync({ alter: true }) // crea/actualiza tablas
    .then(() => {
        console.log('✅ Base de datos conectada');
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('❌ Error DB:', err));
