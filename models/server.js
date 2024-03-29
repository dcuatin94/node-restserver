const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 8080;
        
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }

        //Conectar a base de datos
        this.conectarDB();
        // Middleware
        this.middleware();    
        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middleware(){
        //CORS
        this.app.use(cors());
        //Lectura y parseo del Body
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public')); 
        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            userTempFiles: true,
            tempFileDir: '/tmp/'
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en:', process.env.PORT);
        });
    }
}

module.exports = Server;
