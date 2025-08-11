
// models/UsuarioSala.js
module.exports = (sequelize, DataTypes) => {
    const UsuarioSala = sequelize.define('UsuarioSala', {
        id_usuario_sala: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false },
        id_sala: { type: DataTypes.INTEGER, allowNull: false },
        orden_turno: { type: DataTypes.INTEGER, allowNull: false }, // 1,2,3...
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
        is_spectator: { type: DataTypes.BOOLEAN, defaultValue: false },
        puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
        fichas_historia: { type: DataTypes.BOOLEAN, defaultValue: false },
        fichas_geografia: { type: DataTypes.BOOLEAN, defaultValue: false },
        fichas_deportes: { type: DataTypes.BOOLEAN, defaultValue: false },
        fichas_ciencia: { type: DataTypes.BOOLEAN, defaultValue: false },
        fichas_cultura: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        tableName: 'usuarios_salas',
        timestamps: true,
        createdAt: 'fecha_ingreso',
        updatedAt: 'fecha_actualizacion',
        indexes: [{ unique: true, fields: ['id_usuario', 'id_sala'] }]
    });

    UsuarioSala.associate = models => {
        UsuarioSala.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
        UsuarioSala.belongsTo(models.Sala, { foreignKey: 'id_sala' });
    };

    return UsuarioSala;
};
