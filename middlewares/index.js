const  validarCampos  = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar-jwt');
const  validarRole = require('../middlewares/validar-role');


module.exports = {
    ...validarCampos, ...validarJWT, ...validarRole
}