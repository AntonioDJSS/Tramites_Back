//Esta linea me ayuda a conectar el controlador con las rutas ya que sino no podria 
//realizar el res de manera por default por lo que se iguala
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const generarId = require('../helpers/generarId');
const Usuario = require('../models/usuario');

 

//Aqui lo que se maneja es la url en parametros
const usuariosGet = async (req = request, res = response) => {
  try {
    const { limit = 4, page = 1 } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(skip)
        .limit(parsedLimit)
    ]);

    res.json({
      total,
      usuarios
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'No se pudieron mostrar los usuarios'
    });
  }
};



const usuariosPut = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: Validar contra base de datos

    if (password) {
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
  } catch (error) {
    console.log(error); // Opcional: Imprimir el error en la consola para fines de depuración
    res.status(500).json({
      ok: false,
      msg: 'No se pudo actualizar el usuario',
    });
  }
};



const usuariosDelete = async (req, res = response) => {
  try {
    // Destructuramos de donde viene el id
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findOneAndDelete( id );
    // Esta nos ayuda ya que se elimina desde mi backend pero queda en mi base de datos
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      msg : 'Error al eliminar el usuario' });
  }
};

const usuariosDeleteP = async (req, res = response ) =>{
  const { id } = req.params;
  try {
    // Buscar y eliminar el usuario por ID
    const usuarioEliminado = await Usuario.deleteOne({ _id: id });

    if (usuarioEliminado.deletedCount === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no encontrado',
      });
    }
    res.json({
      ok: true,
      mensaje: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar el usuario',
    });
  }
  
}



  module.exports = {
    usuariosGet,
   
    usuariosPut,
    usuariosDelete,
    usuariosDeleteP,
    
  }