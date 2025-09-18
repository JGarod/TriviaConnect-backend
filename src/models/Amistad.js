
// models/Amistad.js
module.exports = (sequelize, DataTypes) => {
    const Amistad = sequelize.define('Amistad', {
        id_amistad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        id_usuario: { type: DataTypes.INTEGER, allowNull: false }, //id menor
        id_amigo: { type: DataTypes.INTEGER, allowNull: false }, //id mayor
        estado: { type: DataTypes.ENUM('pendiente', 'aceptado', 'bloqueado', 'rechazado', 'cancelado'), defaultValue: 'pendiente' },
        id_solicitante: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'amistades',
        timestamps: true,
        createdAt: 'fecha_solicitud',
        updatedAt: 'fecha_actualizacion',
        indexes: [{ unique: true, fields: ['id_usuario', 'id_amigo'] }]
    });

    Amistad.beforeCreate((amistad, options) => {
        // Normaliza siempre: id_usuario < id_amigo
        if (amistad.id_usuario > amistad.id_amigo) {
            const temp = amistad.id_usuario;
            amistad.id_usuario = amistad.id_amigo;
            amistad.id_amigo = temp;
        }
    });


    Amistad.associate = models => {
        Amistad.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
        Amistad.belongsTo(models.Usuario, { foreignKey: 'id_amigo', as: 'amigo' });
    };

    return Amistad;
};
