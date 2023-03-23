const path = require('path');
const fs = require('fs');
const { response, json } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

const cargarArchivos = async (req, res=response) => {
    //Subir Archivos
    try {
        const nombre = await subirArchivo(req.files, ['pdf', 'txt'], 'textos');
        //no restringir tipo de archivo
        //const nombre = await subirArchivo(req.files, undefined, 'textos');
        res.json({nombre});
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const actualizarImagen = async (req, res=response) =>{
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json( { msg: `No existe un usuario con el id: ${ id }`});
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json( { msg: `No existe un producto con el id: ${ id }`});
            }
            break;
    
        default:
            return json.status(500).json({ msg: 'Validacion no definida'});
    }
    // Limpiar imagenes previas
    if( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if ( fs.existsSync(pathImagen) ) {
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json( modelo );
}

const mostrarImagen = async (req, res=response) =>{
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json( { msg: `No existe un usuario con el id: ${ id }`});
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json( { msg: `No existe un producto con el id: ${ id }`});
            }
            break;
    
        default:
            return json.status(500).json({ msg: 'Validacion no definida'});
    }
    
    if( modelo.img ){
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if ( fs.existsSync(pathImagen) ) {
            return res.sendFile(pathImagen);
        }
    }
    const pathImagen = path.join(__dirname, '../assets', 'no-image.jpg')
    return res.sendFile(pathImagen);
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen
}