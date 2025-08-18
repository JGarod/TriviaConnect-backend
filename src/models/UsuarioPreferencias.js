module.exports = (sequelize, DataTypes) => {
    const Preferencias = sequelize.define('Preferencias', {
        id_preferencia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        acepta_solicitud_amistad: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        color_primario: {
            type: DataTypes.STRING(7),  // Almacena colores en formato hexadecimal (#RRGGBB)
            allowNull: true
        },
        color_secundario: {
            type: DataTypes.STRING(7),
            allowNull: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',  // Refleja el nombre de la tabla de 'Usuarios'
                key: 'id_usuario'  // La clave primaria de la tabla 'Usuarios'
            }
        }
    }, {
        tableName: 'preferencias',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    Preferencias.associate = models => {
        Preferencias.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
    };

    return Preferencias;
};