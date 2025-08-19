//validar que sea un hexa valido y quitarle el #
function limpiarYValidarHex(color) {
    if (typeof color !== 'string') return null;

    // Regex para 6 caracteres hexadecimales, opcional #
    const regex = /^#?([0-9A-Fa-f]{6})$/;

    const match = color.match(regex);
    if (!match) return null; // inválido

    return match[1].toLowerCase(); // el grupo capturado sin #
}

module.exports = { limpiarYValidarHex };
