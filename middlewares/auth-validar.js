const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const  Usuario  = require('../models/usuario');

const protect = async ( req, res, next) =>{

    let token;
    //1)Traer el token y verificar si existe
    //startsWith significa si comienza con Bearer
    // console.log("OK")
    // console.log(req.cookies)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    
    } else if (req.cookies.jwt) {
      // console.log(token)
      token = req.cookies.jwt;
      // console.log(req.cookie)
    }
    if (!token) return res.status(401).send("Tu no has iniciado sesión, por favor inicia sesión para obtener el acceso");
    
    try {
      //2) Verificar si el token es válido
      const decoded = await promisify(jwt.verify)(token, process.env.SECRETORPRIVATEKEY);
    
      //3) Verificar si el usuario existe
      const usuario = await Usuario.findById(decoded.uid)
    
      if (!usuario) return res.status(404).send("El usuario que pertenece a este token ya no existe");
    
      //ACCESO A LA RUTA
      req.usuario = usuario;
      next();
    } catch (error) {
      return res.status(401).send("Token inválido");
    }

}


module.exports = {
    protect
}