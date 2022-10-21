const { response, request } = require('express');


const usuariosGet = (req = request, resp = response)=>{
    const { q, page=1, limit=10 } = req.query;
    resp.json(
        {
            msg:'Method GET API Controller',
            q, page, limit
        }
    );
}

const usuariosPost = (req, resp = response)=>{
    const {nombre, edad} = req.body;
    resp.json(
        {
            msg:'Method POST',
            nombre, edad
        }
);
}

const usuariosPut = (req, resp = response)=>{
    const { id } = req.params;
    resp.json(
        {
            msg:'Method PUT',
            id: id
        }
    );
}

const usuariosPatch = (req, resp = response)=>{
    resp.json({msg:'Method Patch API controller'});
}

const usuariosDelete = (req, resp = response)=>{
    resp.json({msg:'Method DELETE'});
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}