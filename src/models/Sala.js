
// models/Sala.js
module.exports = (sequelize, DataTypes) => {
    const Sala = sequelize.define('Sala', {
        id_sala: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        codigo_sala: { type: DataTypes.STRING(6), allowNull: false, unique: true },
        tipo: { type: DataTypes.ENUM('amistoso', 'competencia'), defaultValue: 'amistoso' },
        estado: { type: DataTypes.ENUM('esperando', 'en_juego', 'finalizado'), defaultValue: 'esperando' },
        turno_global: { type: DataTypes.INTEGER, defaultValue: 1 },           // número global de turno (1,2,3,...)
        turno_usuario_id: { type: DataTypes.INTEGER, allowNull: true },       // FK -> usuarios.id_usuario (quién tiene el turno ahora)
        id_creador: { type: DataTypes.INTEGER, allowNull: false }             // FK -> usuarios.id_usuario
    }, {
        tableName: 'salas',
        timestamps: true,
        createdAt: 'fecha_creacion',
        updatedAt: 'fecha_actualizacion'
    });

    Sala.associate = models => {
        Sala.hasMany(models.UsuarioSala, { foreignKey: 'id_sala' });
        Sala.hasMany(models.PreguntaUsada, { foreignKey: 'id_sala' });
        Sala.belongsTo(models.Usuario, { foreignKey: 'id_creador', as: 'creador' });
        Sala.belongsTo(models.Usuario, { foreignKey: 'turno_usuario_id', as: 'turnoActual' });
    };

    return Sala;
};
