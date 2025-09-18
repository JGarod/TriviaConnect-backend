// models/HistorialAmistades.js
module.exports = (sequelize, DataTypes) => {
    const HistorialAmistades = sequelize.define("HistorialAmistades", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuario_a: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "usuarios", // 👈 nombre real de la tabla
                key: "id_usuario", // 👈 columna real de PK
            },
        },
        usuario_b: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "usuarios",
                key: "id_usuario",
            },
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Amistad",
        },
    }, {
        tableName: "historial_amistades",
        timestamps: true,
    });

    HistorialAmistades.associate = (models) => {
        HistorialAmistades.belongsTo(models.Usuario, {
            as: "UsuarioA",
            foreignKey: "usuario_a",
        });
        HistorialAmistades.belongsTo(models.Usuario, {
            as: "UsuarioB",
            foreignKey: "usuario_b",
        });
    };

    return HistorialAmistades;
};
