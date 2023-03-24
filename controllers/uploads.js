const path = require('path');
const fs = require('fs');
const { response, json } = require("express");
const cloudinary = require('cloudinary').v2;
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

cloudinary.config(process.env.CLOUDINARY_URL);

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

const actualizarImagenCloudinary = async (req, res=response) =>{
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
        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[ nombreArr.length-1 ];
        const [ public_id ] = nombre.split(".");
        cloudinary.uploader.destroy( `RestServer NodeJs/${coleccion}/${ public_id }` );
    }
    
    const { tempFilePath } = req.files.archivo;
    //const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder:`RestServer NodeJs/${coleccion}`} );
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder:`RestServer NodeJs/${coleccion}`} );
    modelo.img = secure_url;
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
    actualizarImagenCloudinary,
    mostrarImagen,
}