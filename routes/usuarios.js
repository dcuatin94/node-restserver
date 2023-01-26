const { Router } = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRol } = require('../middlewares/validar-role');
const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares')

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const routes = Router();

routes.get('/', usuariosGet);

routes.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 caracteres').isLength({ min:6 }),
    check('correo', 'No es un correo valido').isEmail(),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRoleValido ),
    validarCampos,
], usuariosPost);

routes.put('/:id', [
    check('id', 'El id enviado no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

routes.patch('/', usuariosPatch);

routes.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'El id enviado no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] , usuariosDelete);

module.exports = routes;