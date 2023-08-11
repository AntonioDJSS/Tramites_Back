const ResponseError = require('../utils/ResponseError')
const Proyecto = require('../models/proyecto');
const mongoose = require('mongoose');

const crearProyecto = async (req, res) => {
    const { idt, nombre, descripcion, empresa, fechainicio, fechafin, estado } = req.body;

    // Verificar que los campos requeridos estén presentes en la solicitud
    if (!idt || !nombre || !descripcion || !empresa || !fechainicio || !fechafin || !estado) {

      const response = new ResponseError(
        'fail',
        'Faltan campos obligatorios en la solicitud',
        'El id del tramite no exite, porfavor ingresa un id existente.',
        []
    ).responseApiError();

    return res.status(400).json(response);
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

    const proyecto = new Proyecto({ idt, nombre, descripcion, empresa, fechainicio, fechafin, estado });

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

const actualizarProyecto = async (req, res) => {
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

const borrarProyecto = async (req, res) =>{
 
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
        
        const proyectoEliminado = await TimestreamWrite.deleteOne({_id:id});
        
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
}




module.exports = {
    crearProyecto,
    mostrarProyectos,
    actualizarProyecto,
    borrarProyecto
}