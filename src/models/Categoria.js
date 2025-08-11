
// models/Categoria.js
module.exports = (sequelize, DataTypes) => {
    const Categoria = sequelize.define('Categoria', {
        id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true }
    }, {
        tableName: 'categorias',
        timestamps: false
    });

    Categoria.associate = models => {
        Categoria.hasMany(models.Pregunta, { foreignKey: 'id_categoria' });
    };

    return Categoria;
};
