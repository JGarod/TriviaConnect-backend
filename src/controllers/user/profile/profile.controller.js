const { Usuario, Preferencias } = require('../../../models');
const { throwCustomError } = require('../../../utils/throwCustomError');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { crearToken } = require('../../../middlewares/auth/jwt/jwt.middleware');
const { sonAmigos } = require('../../../middlewares/user/amistad/amistad.middleware');

//fBuscar usuario por slug
const findUserBySlug = async (req, res, next) => {
    try {
        let { slug } = req.params;
        let { id } = req.user
        const existe = await Usuario.findOne({
            where: { slug },
            attributes: ['id_usuario', 'avatar', 'nombre_usuario', 'slug', 'uuid_imagen', 'codeFriend'],
            include: [{
                model: Preferencias,  // Relaciona con el modelo Preferencias
                as: 'preferencias',   // Nombre del alias de la relación
                attributes: ['acepta_solicitud_amistad', 'color_primario', 'color_secundario'] // Solo trae los campos necesarios
            }]
        });

        if (!existe) {
            const mensaje = 'La cuenta que buscas no existe';
            throwCustomError(mensaje, 400);
        }
        let busquedaAmistad = await sonAmigos(id, existe.id_usuario);
        let estadoAmistad = null;
        let id_solicitante = null;
        if (busquedaAmistad.estado !== 'N/A') {
            estadoAmistad = busquedaAmistad.estado;
            id_solicitante = busquedaAmistad.id_solicitante;
        }

        const profileData = {
            id_usuario: existe.id_usuario,
            avatar: existe.avatar,
            nombre_usuario: existe.nombre_usuario,
            slug: existe.slug,
            uuid_imagen: existe.uuid_imagen,
            codeFriend: existe.codeFriend,
            // Preferencias
            acepta_solicitud_amistad: existe?.preferencias?.acepta_solicitud_amistad,
            color_primario: existe?.preferencias?.color_primario,
            color_secundario: existe?.preferencias?.color_secundario,
            estado_amistad: estadoAmistad,
            id_solicitante: id_solicitante,
        };

        return res.status(200).json({ existe: profileData,message:'Usuario encontrado' });

        
    } catch (error) {
        next(error);
    }
};

// BUSQUEDA DE USUARIO POR ID
const findUserByIDEdit = async (req, res, next) => {
    try {
        let { id } = req.user;
        const existe = await Usuario.findOne({
            where: {
                id_usuario: id
            },
            attributes: ['id_usuario', 'nombre_usuario', 'slug', 'email']
        });

        if (!existe) {
            const mensaje = 'La cuenta que buscas no existe';
            throwCustomError(mensaje, 400);
        }


        return res.status(200).json({ existe, message: 'Usuario encontrado' });


    } catch (error) {
        next(error);
    }
};

//CTUALIZAR DATOS BASICOS DEL USUARIO
const updateDataBasica = async (req, res, next) => {
    try {
        let { id } = req.user;
        let { nombre_usuario ,email,slug} =req.body;

       await Usuario.update(
            { nombre_usuario, email, slug },
            { where: { id_usuario: id } }
        )
            .then(async ([updated]) => {
                if (updated === 0) {
                    let message = "No se pudo actualizar el usuario"
                    throwCustomError(message, 400);
                }

                const updatedUser = await Usuario.findOne({
                    where: { id_usuario: id },
                    attributes: ['id_usuario', 'uuid_imagen', 'nombre_usuario', 'slug']
                });

                if (!updatedUser) {
                    let message = "Usuario no encontrado"
                    throwCustomError(message, 400);
                }
                const token = await crearToken(updatedUser)

                // const token = jwt.sign(
                //     {
                //         id: updatedUser.id_usuario,
                //         username: updatedUser.nombre_usuario,
                //         slug: updatedUser.slug,
                //         uuid_imagen: updatedUser.uuid_imagen,
                //     },
                //     process.env.JWT_SECRET,
                //     { expiresIn: process.env.JWT_MINUTES }
                // );

                return res.json({ message: "Usuario actualizado correctamente", token, slug });
            })
            .catch((error) => {
                console.log('error',error);
                let message = "Error interno al actualizar usuario" 
                throwCustomError(message,400);
            });

    } catch (error) {
        next(error);
    }
};

//ACTUALIZAR CLAVE USUARIO
const updatePasswordUser = async (req, res, next) => {
    try {
        let {id}=req.user;
        let {passwordUno} = req.body;
        const password_hash = await bcrypt.hash(passwordUno, 10);
        await Usuario.update(
            { password_hash },
            { where: { id_usuario: id } }
        )
        return res.json({ message: "Usuario actualizado correctamente"});

    } catch (error) {
        next(error);
    }
};


//ACTUALIZAR PREFERENCIAS USUARIO
const updatePreferencesUser = async (req, res, next) => {
    try {
        let { id } = req.user;
        let { acepta_solicitud_amistad, color_primario, color_secundario } = req.body;

        await Preferencias.update(
            {
                acepta_solicitud_amistad,
                color_primario,
                color_secundario
            },
            { where: { id_usuario: id } }
        )
        return res.json({ message: "Preferencias actualizadas correctamente" });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    findUserBySlug,
    findUserByIDEdit,
    updateDataBasica,
    updatePasswordUser,
    updatePreferencesUser
}
