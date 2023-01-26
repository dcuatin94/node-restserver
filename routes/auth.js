const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const routes = Router();

routes.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] ,login);

routes.post('/google', [
    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validarCampos
] ,googleSingIn);

module.exports = routes;