const {getOne} = require('./handleFactory')
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const ResponseError = require('../utils/ResponseError')
const mongoose = require('mongoose');
///Control del Usuario/////

const actualPassword = async (req, res)  =>{

    const { password } = req.body;
    const usuario = req.usuario;

    if (!password) {
        const response = new ResponseError(
            'fail',
            'La contraseña es obligatoria',
            'Ingresa la contraseña porfavor no estas ingresando nada',
            []).responseApiError();

        return res.status(400).json(
            response
        );
    }

    // Validar si la contraseña tiene más de 6 caracteres
    if (password.length >= 6) {
        const response = new ResponseError(
            'fail',
            'Contraseña demasiado corta',
            'La contraseña debe tener más de 6 caracteres',
            []
        ).responseApiError();

        return res.status(400).json(
            response
        );
    }

    if (usuario) {
        usuario.password = password;
    }

    try {
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt);
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'Hubo un problema en el hash',
            ex.message,          
            []).responseApiError();
        res.status(500).json(
            response
        )
    }

    try {
        await usuario.save();
        res.status(200).json({
            status: 'successful',
            message: 'Password Modificado Correctamente'
        })
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'El Password no se pudo Modificar',
            ex.message,
            []).responseApiError();

        return res.status(500).json(
            response
        )
    }
};

const actualizarUsuario = async (req, res) => {
    const { nombre, correo } = req.body;
    const usuario = req.usuario;


    if (!usuario) {
        const response = new ResponseError(
            'fail',
            'Usuario no encontrado',
            'El Usuario no se encontro en la peticion protect',
            []).responseApiError();
        
        return res.status(404).json(
            response
        )
    }

    if (nombre) {
        usuario.nombre = nombre;
    }
    if (correo) {
        usuario.correo = correo;
    }
    try {
        await usuario.save();
        res.status(200).json({
            status: 'successful',
            data: usuario,
            message: "Usuario Actualizado Correctamente"
        });
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'No se puede Actualizar',
            ex.message,
            []).responseApiError();
        res.status(500).json(
            response
        )
    }
}

const deleteMe = async(req,res,next)=>{
    await Usuario.findByIdAndUpdate(req.usuario.id,{activo: false});
    res.status(204).json({
        status: "successful",
        data: null,
        message: 'Borrado Correctamente',
    })
};

const getMe = (req,res,next)=>{
   // Verificar si req.usuario está definido
   req.params.id = req.usuario.id;

   if (!req.params.id) {
        const response = new ResponseError(
            'fail',
            'El usuario por id no existe getMe',
            'El usuario no se encontro por el id',
            []).responseApiError();
        return res.status(404).json(
            response
        )
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