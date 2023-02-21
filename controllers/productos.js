const { response } = require("express");
const { Producto } = require("../models");

// ObtenerProductos - paginado - total - populate
const obtenerProductos = async (req, res=response) => {
    const { desde=0, limite=5 } = req.query;
    const query = { estado: true };
    const [ productos, total ] = await Promise.all([
        Producto.find( query )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)),
        Producto.countDocuments(query)
    ]);
    res.json(
        {
            productos,
            total
        }
    );
}
// ObtenerProducto - populate {}
const obtenerProducto = async (req, res=response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    res.json({
        producto
    });
}

const crearProducto = async (req, res=response) => {
    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );
    //Guardar DB
    await producto.save();
    res.status(201).json(producto);
}

// actualizar Producto
const actualizarProducto = async(req, res=response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true });
    res.status(200).json( producto );
}

// borrarCategoria = estado: false
const borrarProducto = async(req, res=response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado:false, new:true});
    res.json( producto );
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}