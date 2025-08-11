
// models/Amistad.js
module.exports = (sequelize, DataTypes) => {
    const Amistad = sequelize.define('Amistad', {
        id_amistad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false },
        id_amigo: { type: DataTypes.INTEGER, allowNull: false },
        estado: { type: DataTypes.ENUM('pendiente', 'aceptado', 'bloqueado'), defaultValue: 'pendiente' }
    }, {
        tableName: 'amistades',
        timestamps: true,
        createdAt: 'fecha_solicitud',
        updatedAt: 'fecha_actualizacion',
        indexes: [{ unique: true, fields: ['id_usuario', 'id_amigo'] }]
    });

    Amistad.associate = models => {
        Amistad.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
        Amistad.belongsTo(models.Usuario, { foreignKey: 'id_amigo', as: 'amigo' });
    };

    return Amistad;
};
