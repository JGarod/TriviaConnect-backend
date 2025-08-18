const sequelize = require('../../config/database');
const { Sequelize } = require('sequelize');

const db = { sequelize, Sequelize };

// importar modelos
db.Usuario = require('./Usuarios')(sequelize, Sequelize.DataTypes);
db.Preferencias = require('./UsuarioPreferencias')(sequelize, Sequelize.DataTypes);

db.Amistad = require('./Amistad')(sequelize, Sequelize.DataTypes);
db.Sala = require('./Sala')(sequelize, Sequelize.DataTypes);
db.UsuarioSala = require('./UsuarioSala')(sequelize, Sequelize.DataTypes);
db.Categoria = require('./Categoria')(sequelize, Sequelize.DataTypes);
db.Pregunta = require('./Pregunta')(sequelize, Sequelize.DataTypes);
db.PreguntaUsada = require('./PreguntaUsada')(sequelize, Sequelize.DataTypes);

// ejecutar asociaciones definidas en cada modelo
Object.keys(db).forEach(name => {
    if (db[name] && typeof db[name].associate === 'function') {
        db[name].associate(db);
    }
});

module.exports = db;
