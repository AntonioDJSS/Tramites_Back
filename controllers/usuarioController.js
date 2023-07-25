const {getOne} = require('./handleFactory')
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
///Control del Usuario/////

const actualPassword = async (req, res)  =>{

    const { password } = req.body;

    const usuario = req.usuario;
    if (usuario) {
        usuario.password = password;
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt);
    }
    try {
        await usuario.save();
        res.status(200).json({
            status: 'success',
            msg: 'Password Modificado Correctamente'
        })
    } catch (error) {
           return res.status(500).json({
            status: "error",
            msg: "El Password no se pudo Modificar"
           })
    }
};

const actualizarUsuario = async (req, res) => {
    const { nombre, correo } = req.body;
    const usuario = req.usuario;
    if (!usuario) {
        return res.status(404).json({
            msg: "Usuario no encontrado"
        });
    }
    try {
        if (nombre) {
            usuario.nombre = nombre;
        }
        if (correo) {
            usuario.correo = correo;
        }
        await usuario.save();
        res.status(200).json({
            status: 'success',
            msg: "Usuario Actualizado Correctamente",
            data: usuario
        });
    } catch (error) {
        return res.status(500).json({
            msg: "No se puede Actualizar"
        });
    }
}

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

   if (!req.params.id) {
        return res.status(404).json({
            msg: "El usuario por id no existe getMe"
        })
   }
  next();
};


const oneUser = getOne(Usuario);


module.exports ={
    actualPassword,
    actualizarUsuario,
    deleteMe,
    getMe,
    oneUser
}