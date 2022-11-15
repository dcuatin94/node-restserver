const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async( req, res = response ) => {
    const { correo, password } = req.body;

    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //Si el usuario esta activo
        if ( usuario.status === false ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - stado = False'
            });
        }
        // Verificar la contrasena
        const validPassword = bcrypt.compareSync( password, usuario.password);
        if ( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //Generar el jwt
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.json(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login
}