const { Role, Usuario, Categoria, Producto } = require('../models');

const esRoleValido = async(rol='') =>{
    const existRole = await Role.findOne({ rol });
    if( !existRole ){
        throw new Error(`El rol ${ rol } no esta registrado en la BD`);
    }
}

const emailExiste = async(correo='') =>{
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error( `El correo ${ correo } ya existe` );
    }
}

const existeUsuarioPorId = async( id ) =>{
    const existeUsuario = await Usuario.findOne({ id });
    if( !existeUsuario){
        throw new Error( `El usuario ${ id } no existe` );
    }
}

/**
 * Categorias
 */

const existeCategoriaPorid = async(id='') =>{
    //Verificar si el id existe
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ){
        throw new Error( `El id ${ id } no existe` );
    }
}

const existeProductoPorid = async(id='') =>{
    //Verificar si el id existe
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ){
        throw new Error( `El id ${ id } no existe` );
    }
}

const existeProductoPorNombre = async(nombre='') =>{
    nombre = nombre.toUpperCase();
    const existeProducto = await Producto.findOne({ nombre });
    console.log(existeProducto)
    if(existeProducto){
        throw new Error( `El nombre ${ nombre } ya existe` );
    }
}

const coleccionesPermitidas = ( coleccion='', colecciones=[] ) => {
    const incluida = colecciones.includes(coleccion);
    if( !incluida ){
        throw new Error(`La coleccion ${ coleccion } no es permitida, ${ colecciones}`);
    } 
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorid,
    existeProductoPorid,
    existeProductoPorNombre,
    coleccionesPermitidas
}