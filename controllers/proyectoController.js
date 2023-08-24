const ResponseError = require('../utils/ResponseError')
const Proyecto = require('../models/proyecto');
const mongoose = require('mongoose');
const Usuario = require('../models/usuario')





const crearProyecto = async (req, res) => {
    const { idt, nombre, descripcion, empresa, fechainicio, fechafin, estado } = req.body;
    const usuario = req.usuario;
    
    if (!usuario) {
        const response = new ResponseError(
          'fail',
          'El usuario no existe',
          'No se encuentra el Usuario en la ruta',
          []).responseApiError();

        res.status(404).json(
          response
        )
    }

    

    // Verificar que los campos requeridos estén presentes en la solicitud
    if (!idt || !nombre || !descripcion || !empresa || !fechainicio || !fechafin || !estado || !usuario) {

      const response = new ResponseError(
        'fail',
        'Faltan campos obligatorios en la solicitud',
        'El id del tramite no exite, porfavor ingresa un id existente.',
        []
    ).responseApiError();

    return res.status(400).json(response);
      }

    const usuarioExiste = await Usuario.findById(usuario.id)

    if(!usuarioExiste){
      const response = new ResponseError(
        'fail',
        'El usuario no existe',
        'El usuario no se encuentra en la BD',
        []).responseApiError();

        res.status(404).json(
          response
        )
    }

    // Validar que idt sea un ID válido de MongoDB
    if (!mongoose.isValidObjectId(idt)) {
      const response = new ResponseError(
        'fail',
        'Faltan campos obligatorios en la solicitud',
        'Ingrese porfavor los campos requeridos para crear su proyecto',
        []
    ).responseApiError();
    return res.status(400).json(response);
    }

    


    const proyecto = new Proyecto({ idt, nombre, descripcion, empresa, fechainicio, fechafin, estado, usuario: usuario.id });

    try {
        await proyecto.save();
        res.status(200).json({
            status: 'success',
            data: proyecto,
            message: 'Proyecto Creado Correctamente'
        });
    } catch (ex) {
        const response = new ResponseError(
            'fail',
            'No se pudo crear el proyecto',
            ex.message,
            []
        ).responseApiError();

        return res.status(500).json(response);
    }
}

//USER

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

//GET  POR ID Y USUARIO DE LA REQ.
//ACTUALIZAR MIS PROYECTOS
//ELIMINAR MIS PROYECTOS





//ADMIN
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
    misProyectos
}