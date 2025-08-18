const { Op } = require("sequelize");
const { Usuario } = require("../models");

function slugify(text) {
    return text
        .toString()
        .normalize("NFD")                   // Quitar acentos
        .replace(/[\u0300-\u036f]/g, "")   // Eliminar diacríticos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')              // Espacios → guiones
        .replace(/[^\w\-]+/g, '')          // Quitar caracteres raros
        .replace(/\-\-+/g, '-');           // Evitar guiones dobles
}

//buscar el slug en la base de datos
const validarSlugUser = async (baseSlug, id=null) => {
    let slug = baseSlug;
    let count = 1;

    const whereBase = { slug };

    // if (id) {
    //     // si hay id, excluimos ese id del filtro
    //     whereBase.id_usuario = { id };
    // }

    while (await Usuario.findOne({ where: whereBase })) {
        slug = `${baseSlug}-${count++}`;
        whereBase.slug = slug; // actualizamos el slug en el filtro
    }
    return slug;
};

module.exports = { slugify, validarSlugUser };
