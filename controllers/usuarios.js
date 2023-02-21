const { response, request, query } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, resp = response)=>{
    const { desde=0, limite=5 } = req.query;
    const query = { estado: true };
    // const usuarios = await Usuario.find( query )
    // .skip( Number( desde ))
    // .limit( Number( limite ));
    // const total = await Usuario.countDocuments( query );
    const [ usuarios, total ] = await Promise.all([
        Usuario.find( query )
                        .skip( Number( desde ))
                        .limit( Number( limite )),
        Usuario.countDocuments( query )
    ]);
    resp.json(
        {
            usuarios,
            total
        }
    );
}

const usuariosPost = async(req, resp = response)=>{
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    
    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guardar usuario
    await usuario.save();
    resp.json(
        {
            msg:'Method POST',
            usuario
        }
);
}

const usuariosPut = async (req, resp = response)=>{
    const { id } = req.params;
    const { password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true});

    resp.json(
        {
            usuario
        }
    );
}

const usuariosPatch = (req, resp = response)=>{
    resp.json({msg:'Method Patch API controller'});
}

const usuariosDelete = async (req, resp = response)=>{
    const { id } = req.params;
    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    //usuario.estado = false;
    resp.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}