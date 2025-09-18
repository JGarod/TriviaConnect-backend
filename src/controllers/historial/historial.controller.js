const { Op, literal } = require("sequelize");
const { Usuario, Amistad, Preferencias, Sequelize, HistorialAmistades } = require("../../models");
const { throwCustomError } = require("../../utils/throwCustomError");

//buscar el historial por offset y limit
const getHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, lastCreatedAt } = req.query;
        if (page <= 0 || limit <= 0) {
            throwCustomError('No puedes enviar un page o limit negativo', 404);
        }

        const { id } = req.user;
        const offset = (page - 1) * limit;

        let amigosRecibidos = await buscarIDSAmigosRecibidos(id);
        let amigosEnviados = await buscarIDSAmigosEnviados(id);
        let todosLosAmigos = [...amigosRecibidos, ...amigosEnviados, id];
        todosLosAmigos = [...new Set(todosLosAmigos)];

        // 🚀 paso lastCreatedAt a getAllHistory para que combine filtros
        let dataHistorial = await getAllHistory(todosLosAmigos, offset, limit, lastCreatedAt);

        res.status(200).json({
            total: dataHistorial.count,
            page: parseInt(page),
            totalPages: Math.ceil(dataHistorial.count / parseInt(limit)),
            data: dataHistorial.response,
            lastCreatedAt: dataHistorial.newLastCreatedAt
        });
    } catch (error) {
        next(error);
    }
};

//buscar amigos recibidos por id
buscarIDSAmigosRecibidos = async (id) => {
    let busquedaRecibido = await Amistad.findAll({
        where: { id_amigo: id, estado: 'aceptado' },
        attributes: ['id_usuario']
    });
    let amigos = [];
    if (busquedaRecibido && busquedaRecibido.length > 0) {
        busquedaRecibido.map(element => {
            amigos.push(element.id_usuario);
        });
    }
    return amigos;
};

//buscar amigos enviado por id
buscarIDSAmigosEnviados = async (id) => {
    let busquedaEnviado = await Amistad.findAll({
        where: { id_usuario: id, estado: 'aceptado' },
        attributes: ['id_amigo']
    });
    let amigos = [];
    if (busquedaEnviado && busquedaEnviado.length>0) {
        busquedaEnviado.map(element=>{
            amigos.push(element.id_amigo);
        });
    }
    return amigos;
};

//obtener el historial de todos los amigos y del usuario
const getAllHistory = async (ids, offset, limit, lastCreatedAt) => {
    try {
        // Base query (paginación)
        let baseWhere = {
            [Op.or]: [
                { usuario_a: { [Op.in]: ids } },
                { usuario_b: { [Op.in]: ids } },
            ]
        };

        let queryOptions = {
            where: baseWhere,
            include: [
                { model: Usuario, as: "UsuarioA", attributes: ["id_usuario", "nombre_usuario", "uuid_imagen",'slug'] },
                { model: Usuario, as: "UsuarioB", attributes: ["id_usuario", "nombre_usuario", "uuid_imagen",'slug'] }
            ],
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        };

        // Consulta con paginación
        const { count, rows } = await HistorialAmistades.findAndCountAll(queryOptions);

        // Mapear resultados
        let paginatedResponse = rows.map(r => ({
            id: r.id,
            texto: r.texto,
            tipo: r.tipo,
            createdAt: r.createdAt,
            usuario_a: r.UsuarioA,
            usuario_b: r.UsuarioB
        }));

        let newResponse = [];

        // 🚀 Consulta adicional si viene lastCreatedAt
        if (lastCreatedAt) {
            let whereNew = {
                ...baseWhere,
                createdAt: { [Op.gt]: new Date(lastCreatedAt) }
            };

            let newRows = await HistorialAmistades.findAll({
                where: whereNew,
                include: queryOptions.include,
                order: [["createdAt", "DESC"]],
            });

            newResponse = newRows.map(r => ({
                id: r.id,
                texto: r.texto,
                tipo: r.tipo,
                createdAt: r.createdAt,
                usuario_a: r.UsuarioA,
                usuario_b: r.UsuarioB
            }));
        }

        // Merge de ambos resultados
        let combined = [...newResponse, ...paginatedResponse];

        // Ordenar para asegurar consistencia
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 🚀 Nueva última fecha para el front
        let newLastCreatedAt = combined.length > 0 ? combined[0].createdAt : lastCreatedAt;

        return {
            count,
            response: combined,
            newLastCreatedAt
        };

    } catch (error) {
        throwCustomError(error, 404);
    }
};


// const asignarHistorial = async (data) => {
//     try {
//         let texto = "";

//         if (r.tipo === "Amistad") {
//             if (r.UsuarioA.id_usuario === idUsuarioActual) {
//                 texto = `Te hiciste amigo de ${r.UsuarioB.nombre_usuario}`;
//             }
//             else if (r.UsuarioB.id_usuario === idUsuarioActual) {
//                 texto = `Te hiciste amigo de ${r.UsuarioA.nombre_usuario}`;
//             }
//             else {
//                 texto = `${r.UsuarioA.nombre_usuario} se hizo amigo de ${r.UsuarioB.nombre_usuario}`;
//             }
//         }

//         return {
//             id:data.id,
//             descripcion: texto,
//             createdAt: data.createdAt
//         }

//     } catch (error) {
//         throwCustomError(error, 404)
//     }
// };
module.exports = {
    getHistory

}
