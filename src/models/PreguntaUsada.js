
// models/PreguntaUsada.js
module.exports = (sequelize, DataTypes) => {
    const PreguntaUsada = sequelize.define('PreguntaUsada', {
        id_pregunta_usada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        id_sala: { type: DataTypes.INTEGER, allowNull: false },
        id_pregunta: { type: DataTypes.INTEGER, allowNull: false },
        fecha_usada: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        tableName: 'preguntas_usadas',
        timestamps: false,
        indexes: [{ unique: true, fields: ['id_sala', 'id_pregunta'] }]
    });

    PreguntaUsada.associate = models => {
        PreguntaUsada.belongsTo(models.Sala, { foreignKey: 'id_sala' });
        PreguntaUsada.belongsTo(models.Pregunta, { foreignKey: 'id_pregunta' });
    };

    return PreguntaUsada;
};
