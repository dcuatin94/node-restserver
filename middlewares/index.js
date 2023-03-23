const  validarCampos  = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar-jwt');
const  validarRole = require('../middlewares/validar-role');
const  validarArchivoSubir = require('../middlewares/validar-archivo');

//Los tres puntos (...) exporta todo lo que tiene el archivo 
//Ejemplo const  validarRole = require('../middlewares/validar-role'); 
//Tiene todo los metos esAdminRole y tieneRol
module.exports = {
    ...validarCampos, ...validarJWT, ...validarRole, ...validarArchivoSubir
}