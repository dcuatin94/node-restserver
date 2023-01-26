const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { validarJWT, validarCampos } = require('../middlewares');

const router = Router();

/**
 * {{ url }}/api/categorias
 */

//Obtener todas las categorías - público
router.get('/', obtenerCategorias);

//Obtener una categoría - público
router.get('/:id', obtenerCategoria);

//crear una categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    check('id', 'El ID enviado no es valido').isMongoId(),
], actualizarCategoria);

//Borrar una categoría - Admin
router.delete('/:id', [
    check('id', 'El Id enviado no es valido').isMongoId(),
], borrarCategoria);

module.exports = router;