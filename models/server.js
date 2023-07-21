const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config'); 
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser')

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';
        this.uploadsPath     = '/api/uploads';
        this.tramiteControllerPath = '/api/tramiteController';

        //Conectar a base de datos
        this.conectarDB();

        //Middleware
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();

    }

    async conectarDB(){
        await dbConnection()
    }
    //Middleware: son funciones que le van añadir otra funcionalidad a un webserver
    //Una funcion que siempre se va a ejecutar siempre que levantemos el servidor
    //Se crea un metodo de Middleware
    //use es la palabra clave de un middleware
    middlewares(){
        // const whitelist = ["http://localhost:5173"];

        // const corsOptions = {
        //     origin: function (origin, callback) {
        //     //   console.log(origin);
        //       if (whitelist.includes(origin)) {
        //         // Puede consultar la API
        //         callback(null, true);
        //       } else {
        //         // No esta permitido
        //         callback(new Error("Error de Cors"));
        //       }
        //     },
        //   };

        //CORD
        this.app.use( cors() );  //(corsOptions)

        //Cokies 
        this.app.use(cookieParser());

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Se hace la l  lamada al directorio publico
        this.app.use( express.static('public'));

         //Maneja Fileupload - Carga de archivos
         this.app.use(fileUpload({
             useTempFiles : true,
             tempFileDir : '/tmp/'
         }));

    }

    //Este es un metodo por lo no tengo haceeso y tengo que usuar la misma sintaxis de mi contructor
    routes(){
        //Vamos a usar un middleware para otorgarle ciertas rutas
        //Conte middleware se llama ak archivo donde tenemos las rutas
        this.app.use(this.authPath,     require('../routes/authRoutes'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.uploadsPath,      require('../routes/uploads'));
        this.app.use(this.tramiteControllerPath, require('../routes/tramiteRoutes'))
    
        // Middleware para manejar rutas no reconocidas
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Ruta no encontrada' });
        });
    }

 
    //Ahora vamos a crear un metodo para mis rutas
    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor correindo en puerto', this.port);
        });
    }
}

module.exports = Server;