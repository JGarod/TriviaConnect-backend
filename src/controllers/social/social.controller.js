const { Op, literal } = require("sequelize");
const { Usuario, Amistad, Preferencias, Sequelize } = require("../../models");

//traer amigos,logros etc de un usuario
const getDatabyID = async (req, res, next) => {
    try {
        let { id } = req.user;
        //     throwCustomError(mensaje, 400);
        let dataUser = await dataUsuariobyID(id);

        // Amigos donde él es id_usuario
        const enviados = await buscarAmigosEnviados(id);

        // Amigos donde él es id_amigo (recibidos)
        const recibidos = await buscarAmigosRecibidos(id);

        // Normalizar
        const todosLosAmigos = [
            ...enviados.map(e => e.amigo),   // usar alias "amigo"
            ...recibidos.map(r => r.usuario) // usar alias "usuario"
        ];

        let dataAmistad = {
            user: dataUser,
            amigos: todosLosAmigos
        };

        res.status(200).json({ message: 'Social cargado', data: dataAmistad });


    } catch (error) {
        next(error);
    }
};

//buscar amigos recibidos por id
buscarAmigosRecibidos = async (id) => {
    let busquedaRecibido = await Amistad.findAll({
        where: { id_amigo: id, estado: 'aceptado' },
        include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre_usuario', 'slug', 'uuid_imagen']
        }]
    });
    return busquedaRecibido;
};

//buscar amigos enviado por id
buscarAmigosEnviados = async (id) => {
    let busquedaEnviado = await Amistad.findAll({
        where: { id_usuario: id, estado: 'aceptado' },
        include: [{
            model: Usuario,
            as: 'amigo',
            attributes: ['id_usuario', 'nombre_usuario', 'slug', 'uuid_imagen']
        }]
    });
    return busquedaEnviado;
};

//buscar data de usuario por ID
dataUsuariobyID = async (id) => {
    let dataUsuario = await Usuario.findOne({
        where: { id_usuario: id },
        attributes: ['nombre_usuario', 'slug', 'uuid_imagen', 'codeFriend'],
        include: [{
            model: Preferencias,  // Relaciona con el modelo Preferencias
            as: 'preferencias',   // Nombre del alias de la relación
            attributes: ['acepta_solicitud_amistad', 'color_primario', 'color_secundario'] // Solo trae los campos necesarios
        }]
    });
    return dataUsuario;
};

const buscarUsuarioString = async (req, res, next) => {
    try {
        let { busqueda } = req.body
        let {id}=req.user;
        let data = await dataUsuariobyString(busqueda, id);
        res.status(200).json({ usuarios: data });


    } catch (error) {
        next(error);
    }
};

//buscar data de usuario por ID
dataUsuariobyString = async (string, idUsuarioActual) => {
    let dataUsuario = await Usuario.findAll({
        where: {
            [Op.or]: [
                { codeFriend: string },
                { email: string },
                { nombre_usuario: { [Op.like]: `%${string}%` } },
            ]
        },
        attributes: ['id_usuario', 'nombre_usuario', 'slug', 'uuid_imagen', 'codeFriend'],
        include: [
            {
                model: Amistad,
                as: 'amistades_enviadas',
                required: false,
                where: { id_amigo: idUsuarioActual },
                // 👇 no pongas attributes aquí, Sequelize arma mal el alias
            },
            {
                model: Amistad,
                as: 'amistades_recibidas',
                required: false,
                where: { id_usuario: idUsuarioActual },
                // 👇 igual aquí
            }
        ]
    });

    // luego centralizas el status en Node
  const usuariosConEstado = dataUsuario.map(u => {
  let estado = null;

  if (u.amistades_enviadas?.length > 0) {
    estado = u.amistades_enviadas[0].estado;
  } else if (u.amistades_recibidas?.length > 0) {
    estado = u.amistades_recibidas[0].estado;
  }

  const json = u.toJSON();
  delete json.amistades_enviadas;
  delete json.amistades_recibidas;

  return {
    ...json,
    amistad_status: estado
  };
});


    return usuariosConEstado || [];
};
module.exports = {
    getDatabyID, buscarUsuarioString

}
