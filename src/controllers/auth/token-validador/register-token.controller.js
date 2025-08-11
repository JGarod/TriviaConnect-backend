const { Usuario } = require("../../../models");
const moment = require('moment-timezone');

const validateTokenRegister = async (req, res, next) => {
    try {
        const { token } = req.body;
        const usuario = await Usuario.findOne({
            where: { token_verificacion: token },
            attributes: ['id_usuario','nombre_usuario', 'token_verificacion_expira', 'email']
        });
        // tipos 1:valido,2:expirado,3:no valido
        if (!usuario) {
            return res.status(200).json({ message: 'Token inválido',tipo:3 });
        }else{
            const fechaExpira = usuario.token_verificacion_expira;
            const ahoraUTC = moment.utc();
            console.log('ahoraUTC', ahoraUTC);
            console.log('fechaExpira', fechaExpira);
            // si la fecha no existe o si existe pero es menor a la fecha actual se muere el token 
            if (!fechaExpira || fechaExpira < ahoraUTC) {
                return res.status(200).json({ message: "Token expirado", tipo: 2 });
            }else{
                usuario.verificado = 1;
                usuario.token_verificacion = null;
                usuario.token_verificacion_expira = null;
                await usuario.save();

                return res.status(200).json({ message: 'Cuenta verificada' ,tipo:1});
            }
        }
        
       
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateTokenRegister
}