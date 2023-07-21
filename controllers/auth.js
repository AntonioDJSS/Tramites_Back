const { response, json } = require("express");
const bcryptjs = require('bcryptjs');
const  Usuario  = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const generarId = require("../helpers/generarId");
const {emailOlvidePassword} = require('../helpers/email')
const {emailRegistro} = require('../helpers/email')
const {getOne} = require('./handleFactory')

const createSendToken = async (usuario, statusCode,req,res) =>{
    //Generar el JWT
    const token = await generarJWT( usuario.id );
    //Las cookies sirven para que el navegador no pueda modicar ni acceder a la cookie que mandaremos
    //Un cookie es un pequeño fragmento de texto
    const cookieOptions ={
        //Fecha en milisegundos
        secure: true,
        //secure:  req.secure || req.headers['x-forwarded-proto'] === 'https',
        expires: new Date (
        Date.now () + 5 * 24 * 60 * 60 * 1000
        ),
        sameSite: 'none',
    }
    // usuario.contraseña = undefined;
    res.cookie('jwt',token,cookieOptions);
  
    /*res.cookie('checkToken', true, {
        secure:  req.secure || req.headers['x-forwarded-proto'] === 'https', 
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 *60 *60*1000),
      }) */
      
    res.status(statusCode).json({
        status: "successful",
        token,
        usuario,
        msg: "Inicio de Sesion Correctamente",
        checkToken: true
    })
}

const login = async(req, res = response) =>{
    const { correo, password } = req.body;
    try {
        //Verificar si el email existe
        const usuario =  await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //Si el usuario esta activo
        if ( !usuario.estado) {
            return res.status(400).json({
                msg: 'Tu cuenta no ha sido confirmada'
            })
        }
        //Verificar la contraseña
        const valiPassword = bcryptjs.compareSync( password, usuario.password);
        if (!valiPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //Enviar un JWT al cliente
    createSendToken(usuario,200,req,res);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const registrar = async (req, res) => {
    try {
      const { nombre, correo, password, rol } = req.body;
      const usuario = new Usuario({ nombre, correo, password, rol });
  
      const salt = bcryptjs.genSaltSync();
      usuario.password = bcryptjs.hashSync(password, salt);
  
      usuario.token = generarId();
      await usuario.save();
  
      emailRegistro({
        correo: usuario.correo,
        nombre: usuario.nombre,
        token: usuario.token,
      });
  
      res.json({
        usuario
      });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({
        msg: 'No se puede registrar el Usuario'
      });
    }
};

const cerrarSesion = async (req, res) =>{
     res.cookie('jwt', 'CerrarSesion',{
         expires: new Date(Date.now() + 10 *1000),
         secure: true,
         sameSite: 'none',
     });
     res.status(200).json({
         status: 'successful'
     })
}

const confirmar = async(req, res = response) =>{
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(403).json({ msg: error.message });
    }
    try {
        usuarioConfirmar.estado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario Confirmado Correctamente "});
    } catch (error) {
        res.status(500).json({
            msg: 'No se pudo confirmar el Usuario'
          });
    }
}

const olvidePassword = async (req, res = response ) =>{
     const { correo } = req.body;
     const usuario = await Usuario.findOne({ correo });
     if (!usuario) {
         const error = new Error ("El usuario no existe");
         return res.status(404).json({ msg: error.message})
     }
     try {
        usuario.token = generarId();
        await usuario.save();
        //enviar email
        emailOlvidePassword({
            correo: usuario.correo,
            nombre: usuario.nombre,
            token: usuario.token,
        })

        res.json({ msg: "Hemos enviado un email con las instrucciones"})
     } catch (error) {
        res.status(500).json({
            msg: 'Hubo un error en el servidor al enviar el email'
          });
     }
    
}

const comprobarToken = async (req, res= response ) =>{
    try {
        const { token } = req.params;
    
        const tokenValido = await Usuario.findOne({ token });
    
        if (tokenValido) {
            res.json({ msg: "Token válido y el Usuario existe" });
        } else {
            const error = new Error("Token no válido");
            return res.status(404).json({ msg: error.message });
        }
    } catch (error) {
        // Aquí se captura cualquier error que ocurra durante la ejecución del código dentro del bloque try
        return res.status(500).json({ 
            msg: "Error al comprobar el token" });
    }
};

const nuevoPassword = async (req, res = response) =>{
    const { token } = req.params;
    const { password } = req.body;
    const usuario = await Usuario.findOne({ token });
    if (usuario) {
        usuario.password = password;
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt);
        usuario.token = "";
        try {
            await usuario.save();
            res.json({ msg: "Password Modificado Correctamente" })
        } catch (error) {
            return res.status(500).json({ 
                msg: "El Password no se pudo Modificar" });
        }
    } else {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message});
    }
}

const googleSignIn = async ( req, res = response ) =>{
    const { id_token } = req.body;
    try {
        const { correo, nombre, img }= await googleVerify( id_token );
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            //Tengo que crearlo
            const data = {
                nombre, 
                correo,
                password: ':p',
                img,
                google: true
            };
            
            usuario = new Usuario(data);
            await usuario.save();
        }
        //Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        //Generar JWT
        const token = await generarJWT( usuario.id );
        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    } 
}

///Control del Usuario/////
const deleteMe = async(req,res,next)=>{
    await Usuario.findByIdAndUpdate(req.usuario.id,{activo: false});
    res.status(204).json({
        status: "successful",
        data: null
    })
};

const getMe = (req,res,next)=>{
   // Verificar si req.usuario está definido
   req.params.id = req.usuario.id;


  
  next();
}

const oneUser = getOne(Usuario);


module.exports ={
    cerrarSesion,
    confirmar,
    comprobarToken,
    login,
    olvidePassword,
    nuevoPassword,
    googleSignIn,
    registrar,
    deleteMe,
    getMe,
    oneUser
}