const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/googel-verify');

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
        if ( !usuario.estado ){
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

const googleSingIn = async(req, res = response) => {
    const {id_token} = req.body;
    try {
        const { nombre, img, correo } = await googleVerify( id_token );
        let usuario = await Usuario.findOne({ correo });
        
        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'Google',
                img,
                google: true,
                rol: 'USER_ROLE',
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Contactese con el administrador, usuario no autorizado'
            });
        }
        
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        });
    }
}

const renovarToken = async (req, res = response) => {
    const  { usuario} = req;
    //Generar el JWT
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    googleSingIn,
    renovarToken
}