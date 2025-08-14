require('dotenv').config();
const { Op } = require('sequelize');
const { Usuario } = require('../../../models');
const { throwCustomError } = require('../../../utils/throwCustomError');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//funcion para loguear un usuario
const loginUser = async (req, res, next) => {
    try {
      let { nombre_usuario, password } = req.body;
      const existe = await Usuario.findOne({
        where: {
          [Op.or]: [
            { email: nombre_usuario },
            { nombre_usuario: nombre_usuario }
          ]
        },
        attributes: ['id_usuario', 'password_hash','nombre_usuario']
      });

      if (!existe) {
        const mensaje = 'La cuenta que buscas no se encuentra registrada';
        throwCustomError(mensaje, 400);
      }
      const validPassword = await bcrypt.compare(password, existe.password_hash);
      if (!validPassword){
        throwCustomError('Contraseña incorrecta', 400);
      }else{
        const token = jwt.sign(
          {
            id: existe.id_usuario,
            username: existe.nombre_usuario
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_MINUTES, }
        );
        return res.status(200).json({token});

      }
    } catch (error) {
        next(error);
    }
};


module.exports = { 
  loginUser
}
