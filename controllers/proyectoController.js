const ResponseError = require('../utils/ResponseError')
const Proyecto = require('../models/proyecto');
const mongoose = require('mongoose');
const Usuario = require('../models/usuario')
const {ObjectId} = require('mongodb');



const crearProyecto = async (req, res) => {
  const { idt, nombre, descripcion, empresa, fechainicio, fechafin, estado } = req.body;
  const usuario = req.usuario;

  if (!usuario) {
      // Manejo de error cuando no se encuentra el usuario
      return res.status(404).json({
          status: 'fail',
          message: 'El usuario no existe en la ruta'
      });
  }

  // Verificar que los campos requeridos estén presentes en la solicitud
  if (!nombre || !descripcion || !empresa || !fechainicio || !fechafin || !estado) {
      // Manejo de error cuando faltan campos obligatorios
      return res.status(400).json({
          status: 'fail',
          message: 'Faltan campos obligatorios en la solicitud'
      });
  }

  try {
      const usuarioExiste = await Usuario.findById(usuario.id);

      if (!usuarioExiste) {
          // Manejo de error cuando el usuario no existe en la base de datos
          return res.status(404).json({
              status: 'fail',
              message: 'El usuario no existe en la BD'
          });
      }

      if(!(ObjectId.isValid(idt))) {
        return res.status(400).json({
      status: 'fail',
             message: 'Alguno de los IDs de tramite no es válido'
        });
      }

      // Validar que idt sea un arreglo de IDs válidos de MongoDB
      // const areValidObjectIds = idt.every(mongoose.isValidObjectId);
      // if (!areValidObjectIds) {
      //     return res.status(400).json({
      //         status: 'fail',
      //         message: 'Alguno de los IDs de tramite no es válido'
      //     });
      // }

      // Crear el proyecto con los datos proporcionados
      const proyecto = new Proyecto({
        idt: idt.map(id => ({ id: new mongoose.Types.ObjectId(id) })),
          nombre,
          descripcion,
          empresa,
          fechainicio,
          fechafin,
          estado,
          usuario: usuario.id
      });

      await proyecto.save();

      res.status(200).json({
          status: 'success',
          data: proyecto,
          message: 'Proyecto Creado Correctamente'
      });
  } catch (ex) {
      console.error(ex);
      res.status(500).json({
        status: 'fail',
        message: 'No se pudo crear el proyecto'
    });
  }
}


////////////////////USER///////////////////////////////////////
//GET  POR ID Y USUARIO DE LA REQ.
const misProyectos = async (req, res) =>{

  const usuario = req.usuario;
  const { id } =  req.query;

  if(!usuario){
    const response = new responseApiError(
      'fail',
      'Usuario no encontrado, no te encuentras logueado',
      'No estas logueado, porfavor logueate',
     []).responseApiError();

    res.status(404).json(
      response
    )
  }


if (id) {

  const miProyecto = await Proyecto.findOne({ _id: id, usuario: usuario.id });

  if (!miProyecto) {
    const response = new ResponseError(
      'fail',
      'No existen proyectos',
      'No cuentas con proyectos existentes, porfavor crea proyectos',
    []).responseApiError();

    res.status(404).json(
      response
    )
  }

  res.status(200).json({
    status: 'sucessful',
    data: miProyecto,
    message: 'Proyectos Encontrados Correctamente'
  })
  
} else {
  const miProyecto = await Proyecto.find({usuario: usuario.id});

  if (!miProyecto) {
    const response = new ResponseError(
      'fail',
      'No existen proyectos',
      'No cuentas con proyectos existentes, porfavor crea proyectos',
    []).responseApiError();

    res.status(404).json(
      response
    )
  }

  res.status(200).json({
    status: 'sucessful',
    data: miProyecto,
    message: 'Proyectos Encontrados Correctamente'
  })
}

  
  
  

 
  

  
}
//ACTUALIZAR MIS PROYECTOS
const actualizarProyecto = async (req, res) =>{
  const { id } = req.params;
  const nuevoProyecto = req.body;
  const usuario = req.usuario;

  //  console.log(usuario.id)

  if (!id) {
    const response = new ResponseError(
      'fail',
      'ID no ingresado',
      'Proporciona un id de un proyecto',
      []
    ).responseApiError();

    return res.status(500).json(response);
  }

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

  let proyecto = await Proyecto.findOne({ _id: id });

  if (!proyecto) {
    const response = new ResponseError(
      'fail',
      'Proyecto no encontrado',
      'No hay ningún proyecto, por favor asigna un proyecto existente',
      []
    ).responseApiError();

    return res.status(404).json(response);
  }
  //  console.log(proyecto.usuario)
try {
  
    if (usuario.id == proyecto.usuario) {
      proyecto.set(nuevoProyecto); // Actualiza los campos con los valores del nuevoProyecto
    await proyecto.save();
    } else{
      const response = new ResponseError(
        'fail',
        'No puedes actualizar este proyecto, no cuentas con el permiso necesario',
        'No puedes actualizar el proyecto , porfavor actualiza uno de tus proyectos',
        []).responseApiError();
  
      res.status(500).json(
        response
      )
    }

  res.status(200).json({
    status: 'successful',
    data: proyecto,
    message: 'Proyecto Actualizado Correctamente',
  });
} catch (ex) {
  const response = new ResponseError(
    'fail',
    'Hubo error al actualizar el proyecto',
    ex.message,
    []). responseApiError();

    res.status(500).json(
      response
    )
}

  
}
//ELIMINAR MIS PROYECTOS
const borrarProyecto = async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  // console.log(usuario.id)
  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

  try {
    // Buscar el proyecto por su ID
    const proyectoEncontrado = await Proyecto.findOne({ _id: id });

    if (!proyectoEncontrado) {
      const response = new ResponseError(
        'fail',
        'Proyecto no encontrado',
        'El proyecto no se encuentra al realizar la búsqueda',
        []
      ).responseApiError();

      return res.status(404).json(response);
    }
    // console.log(proyectoEncontrado.usuario)

    if (usuario.id == proyectoEncontrado.usuario) {
      // Eliminar el proyecto encontrado
      await proyectoEncontrado.deleteOne(); // Utilizar deleteOne() en lugar de delete()
    } else {
      const response = new ResponseError(
        'fail',
        'No tienes el permiso para eliminar este proyecto',
        'No puedes eliminar este proyecto porque no cuentas con el permiso necesario',
        []
      ).responseApiError();
  
      return res.status(500).json(response);
    }

    res.status(200).json({
      status: 'successful',
      message: 'Proyecto eliminado correctamente',
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al eliminar el proyecto',
      ex.message,
      []
    ).responseApiError();

    return res.status(500).json(response);
  }
};





///////////////////ADMIN////////////////////////////////
const mostrarProyectos = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  try {
    const totalProyectos = await Proyecto.countDocuments(); // Contar el total de proyectos en la base de datos
    const skip = (page - 1) * limit;
    const proyectos = await Proyecto.find().skip(skip).limit(Number(limit));

    res.status(200).json({
      status: 'successful',
      total: totalProyectos, // Agregar el total de proyectos al resultado
      data: proyectos,
      message: 'Proyectos Encontrados'
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al realizar la búsqueda en la BD',
      ex.message,
      []
    ).responseApiError();

    return res.status(500).json(response);
  }
};
const actualizarProyectos = async (req, res) => {
  const { id } = req.params;
  const nuevoProyecto = req.body;

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

  try {
    let proyecto = await Proyecto.findOne({ _id: id });

    if (!proyecto) {
      const response = new ResponseError(
        'fail',
        'Proyecto no encontrado',
        'No hay ningún proyecto, por favor asigna un proyecto existente',
        []
      ).responseApiError();

      return res.status(404).json(response);
    }

    proyecto.set(nuevoProyecto); // Actualiza los campos con los valores del nuevoProyecto

    await proyecto.save();

    res.status(200).json({
      status: 'successful',
      data: proyecto,
      message: 'Proyecto Actualizado Correctamente',
    });
  } catch (ex) {
    const response = new ResponseError(
      'fail',
      'Error al guardar el proyecto',
      ex.message,
      []
    ).responseApiError();

    res.status(500).json(response);
  }
};
const borrarProyectos = async (req, res) =>{
 
    const {id} = req.params;

  // Validar si el ID es un ObjectId válido de MongoDB
  if (!mongoose.isValidObjectId(id)) {
    const response = new ResponseError(
      'fail',
      'ID inválido',
      'El ID proporcionado no es válido',
      []
    ).responseApiError();

    return res.status(400).json(response);
  }

    try {
        
        const proyectoEliminado = await Proyecto.deleteOne({_id:id});
        
        if (proyectoEliminado.deletedCount === 0) {
            const response = new ResponseError(
              'fial',
              'Proyecto no encontrado',
              'El proyecto no se encuentra al realizar la busqueda',
              []).responseApiError();
      
            return res.status(404).json(
              response
            )
          }
        
        
        res.status(200).json({
            status: 'successful',
            message: 'Proyecto eliminado correctamente',
          });
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'Error al eliminar el proyecto',
            ex.message,
            []).responseApiError();
      
          return res.status(500).json(
            response
          )
    }
};





module.exports = {
    crearProyecto,
    mostrarProyectos,
    actualizarProyectos,
    borrarProyectos,
    misProyectos,
    actualizarProyecto,
    borrarProyecto
}