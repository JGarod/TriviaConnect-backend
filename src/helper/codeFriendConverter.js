const { Usuario } = require("../models");

const generarCodigoAmigo = async () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
    let codeFriend = '';

    // generar un código aleatorio de 6 caracteres
    for (let i = 0; i < 6; i++) {
        codeFriend += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    // mientras exista el codigo volvemos a generar y buscar xd
    while (await Usuario.findOne({ where: { codeFriend } })) {
        codeFriend = '';
        for (let i = 0; i < 6; i++) {
            codeFriend += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
    }
    return `${codeFriend}`; 
};

module.exports = { generarCodigoAmigo };
