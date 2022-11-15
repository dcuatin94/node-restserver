const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req=request, res= response, next) => {

    const token = req.headers['x-token'];
    if( !token ){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if( !usuario ){
            return res.status(401).json({
                msg:'Token no valido-usuario no exite en DB',
            });
        }

        //Verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(401).json({
                msg: "Token no valido-usuario eliminado"
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }
}

module.exports = {
    validarJWT
}