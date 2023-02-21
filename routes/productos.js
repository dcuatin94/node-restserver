const { Router } = require("express");
const { check } = require("express-validator");
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { existeProductoPorid, existeCategoriaPorid, existeProductoPorNombre } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

/**
 * {{ url }}/api/productos
 */

//Obtener productos
router.get('/', obtenerProductos);

//Obtener un producto
router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorid ),
    validarCampos
], obtenerProducto);

//Crear un producto
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeProductoPorNombre),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorid ),
    validarCampos
], crearProducto);

//Actualiar Producto
router.put('/:id',[
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorid ),
    validarCampos
], actualizarProducto);

//Borrar un producto
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom( existeProductoPorid ),
    validarCampos
], borrarProducto);

module.exports = router;