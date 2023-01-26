const { response } = require("express");
const { Categoria } = require("../models");

// ObtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res=response) => {
    const { desde=0, limite=5 } = req.query;
    const query = { estado: true };
    const [ categorias, total ] = await Promise.all([
        Categoria.find( query ).populate('usuario').skip(Number(desde)).limit(Number(limite)),
        Categoria.countDocuments(query)
    ]);
    res.json(
        {
            categorias,
            total
        }
    );
}
// ObtenerCategoria - populate {}
const obtenerCategoria = async (req, res=response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario');
    res.json({
        categoria
    });
}

const crearCategoria = async (req, res=response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    //Guardar DB
    await categoria.save();
    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req, res=response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(id, {nombre:nombre});
    console.log(categoria);
    res.json( categoria );
}

// borrarCategoria = estado: false
const borrarCategoria = async(req, res=response) => {
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});
    res.json( categoria );
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}