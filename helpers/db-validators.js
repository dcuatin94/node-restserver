const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol='') =>{
    const existRole = await Role.findOne({ rol });
    if( !existRole ){
        throw new Error(`El rol ${ rol } no esta registrado en la BD`);
    }
}

const emailExiste = async(correo='') =>{
    const existeEmail = await Usuario.findOne({ correo });
    if(!existeEmail){
        throw new Error( `El correo ${ correo } ya existe` );
    }
}

const existeUsuarioPorId = async( id ) =>{
    const existeUsuario = await Usuario.findOne({ id });
    console.log(existeUsuario);
    if(!existeUsuario){
        throw new Error( `El usuario ${ id } no existe` );
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}