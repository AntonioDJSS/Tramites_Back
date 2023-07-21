const {getOne} = require('./handleFactory')
const Usuario = require('../models/usuario');
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

   if (!req.params.id) {
        return res.status(404).json({
            msg: "El usuario por id no existe getMe"
        })
   }
  next();
};




const oneUser = getOne(Usuario);


module.exports ={
    
    deleteMe,
    getMe,
    oneUser
}