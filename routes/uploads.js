const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const routes = Router();

routes.post('/', validarArchivoSubir, cargarArchivos);

routes.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>(coleccionesPermitidas(c, ['usuarios', 'productos']))),
    validarCampos
], actualizarImagen);

routes.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>(coleccionesPermitidas(c, ['usuarios', 'productos']))),
    validarCampos
], mostrarImagen );

module.exports = routes;