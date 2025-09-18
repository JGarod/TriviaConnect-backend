const { Amistad } = require("../../../models");
const { throwCustomError } = require("../../../utils/throwCustomError");
const { esquemaGestionarAmistad } = require("../../../validadores/user/amistad/amistad");

//organizar la amistad y buscarla en la tabla
const validarAmistad = async(req, res, next) => {
    let {id_usuario,estado} =req.body; //amistad
    let {id}=req.user
    if (id===id_usuario) {
        throwCustomError('No se puede añadir a si mismo',400);
    }
    let validarAmistad = await sonAmigos(id, id_usuario);
    console.log('validarAmistad.estado', validarAmistad.estado);
    if (validarAmistad.estado === estado) {
        let dataAmistad = {
            estado_amistad: validarAmistad.estado,
            id_solicitante: validarAmistad.id_solicitante,
        }
        return res.status(200).json({ message: 'Amistad enviada', estado: dataAmistad });

        // throwCustomError('No se puede enviar el mismo estado', 400);
    }
    req.body.estadoAmistad = validarAmistad;
    next();
};

//valida que venga username y email


// valida que llegue objeto de preferencias
const ValidarSchemaAmistad = (req, res, next) => {
    const { error } = esquemaGestionarAmistad.validate(req.body, { abortEarly: false });

    if (error) {
        const mensajesErrores = error.details.map(detalle => detalle.message);
        return res.status(400).json({
            message: "Errores de validación",
            detalles: mensajesErrores
        });
    } else {
        next();
    }


};

//organizar para asignar el idusuario y amigo y el estado
async function sonAmigos(usuarioId, amigoId) {
    let u = usuarioId;
    let a = amigoId;

    if (u > a) {
        const temp = u;
        u = a;
        a = temp;
    }
    const amistad = await Amistad.findOne({
        where: { id_usuario: u, id_amigo: a },
        attributes: ['estado','id_solicitante']
    });
let estadoReturn = 'N/A';
let Solicitante = 'N/A'
    if (amistad) {
        estadoReturn=amistad.estado;
        Solicitante = amistad.id_solicitante
}
    return {
        id_usuario:u,
        id_amigo:a,
        estado: estadoReturn,
        id_solicitante: Solicitante
    }
}


module.exports = {
    validarAmistad,
    ValidarSchemaAmistad,
    sonAmigos
}
