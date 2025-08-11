
// models/Usuario.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombre_usuario: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },

        // Nuevo: estado de verificación
        verificado: { type: DataTypes.BOOLEAN, defaultValue: false },

        // Nuevo: token para verificar cuenta
        token_verificacion: { type: DataTypes.STRING, allowNull: true },
        token_verificacion_expira: { type: DataTypes.DATE, allowNull: true },

        // // Nuevo: token para resetear contraseña
        // token_reset: { type: DataTypes.STRING, allowNull: true },
        // token_reset_expira: { type: DataTypes.DATE, allowNull: true }
        
    }, {
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    Usuario.associate = models => {
        Usuario.hasMany(models.UsuarioSala, { foreignKey: 'id_usuario' });
        Usuario.hasMany(models.Amistad, { foreignKey: 'id_usuario' });
        Usuario.hasMany(models.Amistad, { foreignKey: 'id_amigo', as: 'amistades_recibidas' });
    };

    return Usuario;
};
