const { Usuario, Preferencias, Amistad, HistorialAmistades } = require('../../../models');
const { throwCustomError } = require('../../../utils/throwCustomError');

//Gestionar una amistad
const gestionarAmistad = async (req, res, next) => {
    try {
        let { estadoAmistad,estado } = req.body;
        let { id } = req.user;
        let idSolicitante = id;
        if (estadoAmistad.estado === 'N/A') {
            await Amistad.create({
                id_usuario: estadoAmistad?.id_usuario,
                id_amigo: estadoAmistad?.id_amigo,
                estado: 'pendiente',
                id_solicitante: id
            });
        } else if (estadoAmistad.estado === 'cancelado') {
            await Amistad.update(
                { estado, id_solicitante: id },
                {
                    where: {
                        id_usuario: estadoAmistad?.id_usuario,
                        id_amigo: estadoAmistad?.id_amigo,
                    }
                }
            )
        } else {
            idSolicitante = estadoAmistad.id_solicitante
            await Amistad.update(
                { estado },
                {
                    where: {
                        id_usuario: estadoAmistad?.id_usuario,
                        id_amigo: estadoAmistad?.id_amigo,
                    }
                }
            )
            if (estado === "aceptado") {
                await HistorialAmistades.create({
                    usuario_a: estadoAmistad?.id_usuario,
                    usuario_b: estadoAmistad?.id_amigo,
                    tipo: "Amistad"
                });
            }
        }
        //se puso idSolicitante porque si es nuevo o se va a cancelar el id_solicitante es la persona que lo hace , pero si es una actualizacion de estados es el que lo hizo inicialmente
        let dataAmistad = {
            estado_amistad: estado,
            id_solicitante: idSolicitante,
        }
        // let { slug } = req.params;
        // const existe = await Amistad.findOne({
        //     where: { slug },
        //     attributes: ['id_usuario', 'avatar', 'nombre_usuario', 'slug', 'uuid_imagen', 'codeFriend'],
        //     include: [{
        //         model: Preferencias,  // Relaciona con el modelo Preferencias
        //         as: 'preferencias',   // Nombre del alias de la relación
        //         attributes: ['acepta_solicitud_amistad', 'color_primario', 'color_secundario'] // Solo trae los campos necesarios
        //     }]
        // });

        // if (!existe) {
        //     const mensaje = 'La cuenta que buscas no existe';
        //     throwCustomError(mensaje, 400);
        // }

        // const profileData = {
        //     id_usuario: existe.id_usuario,
        //     avatar: existe.avatar,
        //     nombre_usuario: existe.nombre_usuario,
        //     slug: existe.slug,
        //     uuid_imagen: existe.uuid_imagen,
        //     codeFriend: existe.codeFriend,
        //     // Preferencias
        //     acepta_solicitud_amistad: existe?.preferencias?.acepta_solicitud_amistad,
        //     color_primario: existe?.preferencias?.color_primario,
        //     color_secundario: existe?.preferencias?.color_secundario
        // };

        return res.status(200).json({ message: 'Amistad enviada', estado:dataAmistad });


    } catch (error) {
        next(error);
    }
};


module.exports = {
    gestionarAmistad,

}
