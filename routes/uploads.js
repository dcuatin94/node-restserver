const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos } = require('../controllers/uploads');
const { validarCampos } = require('../middlewares/validar-campos');
const routes = Router();
routes.post('/', cargarArchivos);
module.exports = routes;