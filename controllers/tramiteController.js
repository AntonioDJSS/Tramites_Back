const Tramite = require('../models/tramite')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx');
const fs = require('fs');
const mongoose = require('mongoose');

const actualizarTramite = async (req, res) => {
  const { id } = req.params;
  const nuevosTramites = req.body.tramites;
  try {
    const tramite = await Tramite.findOne({ _id: id });
    if (!tramite) {
      return res.status(404).json({
        status: "error",
        msg: 'Tramite no encontrado' });
    }

    const tramiteActualizado = tramite.toObject(); // Convertir a objeto JavaScript

    tramiteActualizado.tramites = tramiteActualizado.tramites.map(
      (tramiteAnterior, index) => {
        const nuevoTramite = nuevosTramites[index];
        return {
          ...tramiteAnterior,
          nombre: nuevoTramite.nombre,
          valor: nuevoTramite.valor
        };
      }
    );

    const tramiteActualizadoDB = await Tramite.findOneAndUpdate(
      { _id: id },
      tramiteActualizado,
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: tramiteActualizadoDB
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      msg: 'Error al actualizar el tramite',
      error: error.msg });
  }
};

const borrarTramite = async (req, res) => {
  const { id } = req.params;

  try {
    const tramite = await Tramite.findOne({ _id: id });
    if (!tramite) {
      return res.status(404).json({ 
        status: "error",
        msg: 'Tramite no encontrado' });
    }
    tramite.tramites = tramite.tramites.filter((t) => t._id.toString() !== id);
    // Guardar los cambios utilizando la función `updateOne` de Mongoose
    await Tramite.deleteOne({ _id: id }, { tramites: tramite.tramites });
    res.status(200).json({ 
      status: 'success',
      msg: 'Tramite eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ 
      status: "error",
      msg: 'Error al eliminar el tramite',
      error: error.msg });
  }
};

const borrarAllTramite = async (req, res) => {
  try {
    const tramites = await Tramite.find();

    if (tramites.length === 0) {
      return res.status(404).json({
        status: "error",
        msg: 'No existe ningún trámite'
      });
    }

    await Tramite.deleteMany();

    res.status(200).json({
      status: 'success',
      msg: 'Se han eliminado todos los trámites'
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      msg: 'Error al eliminar todos los trámites',
      error: error.msg });
      
  }
};

// Reemplaza esto:
// const mongoose = require('mongoose');
//Lo busca por Id
const buscarTramite = async (req, res) => {
  const { nombre, id, valor, page, limit } = req.query;
  try {
    // Creamos un objeto de consulta
    const query = {};
    // Si el parámetro 'nombre' está presente en la consulta, agregamos una expresión de búsqueda para el campo 'nombre' del array 'tramites'
    if (nombre) {
      query['tramites.nombre'] = { $regex: nombre, $options: 'i' };
    }
    // Si el parámetro 'valor' está presente en la consulta, agregamos una expresión de búsqueda para el campo 'valor' del array 'tramites'
    if (valor) {
      query['tramites.valor'] = { $regex: valor, $options: 'i' };
    }

    if (id) {
      query['_id'] = id; // Asignamos el valor del parámetro 'id' a la consulta para buscar el trámite por su _id específico
    }

    // Convertir los parámetros de paginación y límite a números enteros
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10; // Si no se proporciona 'limit', se asume un límite predeterminado de 10 registros por página
    // Calcular el número de registros para omitir y paginar correctamente los resultados
    const skip = (pageNumber - 1) * limitNumber;

    // Realizar la búsqueda en la base de datos utilizando Mongoose con paginación y límite
    const tramites = await Tramite.find(query)
      .skip(skip)
      .limit(limitNumber);
    res.status(200).json({
      status: 'success',
      data: tramites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error",
      msg: 'Error al buscar el trámite',
      error: error.msg });
  }
};

//Ya nada mas lee el archivo
const cargarTramite = async (req, res) => {
  try {
    // Verificamos si se ha enviado un archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      return res.status(400).json({
        status: "error",
        msg: 'No hay archivos que subir'
      });
    }

    const { archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extensión
    const extensionesValidas = ['xlsx'];
    if (!extensionesValidas.includes(extension)) {
      return res.status(400).json({
        status: "error",
        msg: `La extensión ${extension} no es permitida, las extensiones permitidas son: ${extensionesValidas.join(', ')}`,
      });
    }

    // Leer el archivo a través del buffer
    const workbook = xlsx.read(archivo.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir los datos a JSON incluyendo celdas vacías con valor null
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: null,
    });

    // Procesar los datos (limpiar espacios) y guardarlos en el arreglo tramites
    const tramites = [];
    for (const row of jsonData) {
      const tramite = []; // Crear un nuevo arreglo para cada fila
      const keys = Object.keys(row);
      for (const key of keys) {
        let value = row[key];
        // Convertir el valor a una cadena de texto antes de usar 'trim()'
        value = String(value);
        const cleanValue = value.trim() !== '' ? value.trim() : null; // Si está vacío, asignar null

        // Verificar que el campo nombre tenga un valor antes de agregarlo al arreglo tramite
        if (key.trim() !== '') {
          tramite.push({ nombre: key, valor: cleanValue });
        }
      }
      // Agregar el arreglo de la fila al arreglo principal tramites
      tramites.push(tramite);
    }

    // Crear un documento de Tramite con los datos procesados y guardarlo en la base de datos
    for (const tramite of tramites) {
      try {
        const nuevoTramite = new Tramite({ tramites: tramite });
        await nuevoTramite.save();
      } catch (error) {
        res.status(500).json({
          status: "error",
          msg: 'Error al guardar el tramite',
          error: error.msg
        });
        // Aquí puedes decidir cómo manejar los errores al guardar cada trámite
      }
    }

    res.status(200).json({
      status: 'success',
      data: tramites,
      msg: 'File uploaded and processed successfully',
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: 'Error al cargar el trámite',
      error: error.msg
    });
  }
};


const crearTramite = async (req, res) => {
  try {
    const tramite = Tramite(req.body);
    const response = await tramite.save();
    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "Error al crear el trámite",
      error: error.msg
    });
  }
};

const mostrarTramite = async (req, res) => {
  try {
    // Obtener los valores de page y limit del query string (si no se proporcionan, se utilizarán valores predeterminados)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Por ejemplo, 10 registros por página

    // Calcular el número de documentos que se deben omitir antes de mostrar los registros de la página actual
    const skip = (page - 1) * limit;

    // Realizar la consulta a la base de datos con el paginado
    const tramite = await Tramite.find().skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      data: tramite,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      msg: "Error al mostrar los registros",
      error: error.msg
    });
  }
};

module.exports = {
  actualizarTramite,
  borrarTramite,
  borrarAllTramite,
  buscarTramite,
  cargarTramite,
  crearTramite,
  mostrarTramite

}