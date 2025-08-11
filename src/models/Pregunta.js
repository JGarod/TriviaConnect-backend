
// models/Pregunta.js
module.exports = (sequelize, DataTypes) => {
    const Pregunta = sequelize.define('Pregunta', {
        id_pregunta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        texto: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        id_categoria: { type: DataTypes.INTEGER, allowNull: false },
        dificultad: { type: DataTypes.ENUM('easy', 'medium', 'hard'), allowNull: true },
        opcion_correcta: { type: DataTypes.STRING(255), allowNull: false },
        opciones_incorrectas: { type: DataTypes.JSON, allowNull: false },
        fuente: { type: DataTypes.STRING(50), allowNull: true }
    }, {
        tableName: 'preguntas',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: false,
        //este indice es para que no repita pregunta de la misma categoria
        indexes: [
            {
                unique: true,
                fields: [
                    { name: 'texto', length: 255 }, // solo indexa los primeros 255 caracteres
                    'id_categoria'
                ]
            }
        ]

    });

    Pregunta.associate = models => {
        Pregunta.belongsTo(models.Categoria, { foreignKey: 'id_categoria' });
        Pregunta.hasMany(models.PreguntaUsada, { foreignKey: 'id_pregunta' });
    };

    return Pregunta;
};
